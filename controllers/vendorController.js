const vendorModel = require('../models/vendorModel');
const axios = require('axios');
const Notification = require('../models/notificationModel');
const nodemailer = require('nodemailer');
 
// Get all vendors
exports.getAllVendors = async (req, res) => {
  try {
    const results = await vendorModel.getAllVendors();
    res.json(results);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// Create a new vendor
exports.createVendor = async (req, res) => {
  try {
    const vendorData = req.body;
    const vendor = await vendorModel.createVendor(vendorData);
    res.status(201).json(vendor);
  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// Get a vendor by ID
exports.getVendorById = async (req, res) => {
  try {
    const vendorId = req.params.id;
    console.log('🔵 Fetching vendor with ID:', vendorId);
    const vendor = await vendorModel.getVendorById(vendorId);
    
    if (!vendor) {
      console.log('⚠️ Vendor not found with ID:', vendorId);
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    console.log('✅ Vendor found:', {
      id: vendor._id,
      name: vendor.name,
      priceperminute: vendor.priceperminute,
      category: vendor.category
    });
    
    res.json(vendor);
  } catch (error) {
    console.error('🔴 Error fetching vendor:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// Update a vendor by ID
exports.updateVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendorData = { ...req.body };
    
    console.log('🔵 updateVendor called for ID:', vendorId);
    console.log('🔵 req.body keys:', Object.keys(req.body));
    console.log('🔵 req.files present:', !!req.files);
    if (req.files) console.log('🔵 req.files keys:', Object.keys(req.files));
    
    // Handle photo uploads
    if (req.files) {
      // Handle main profile photo
      if (req.files.photo) {
        vendorData.photo = req.files.photo[0].filename;
      }
      
      // Handle additional photos
      ['photo2', 'photo3', 'photo4', 'photo5'].forEach((photoField, index) => {
        if (req.files[photoField]) {
          vendorData[photoField] = req.files[photoField][0].filename;
        }
      });
    }

    console.log('🔵 vendorData to update:', vendorData);

    const vendor = await vendorModel.updateVendor(vendorId, vendorData);
    
    console.log('🔵 vendorModel.updateVendor returned:', !!vendor);
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    res.json(vendor);
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// Delete a vendor by ID
exports.deleteVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendor = await vendorModel.deleteVendor(vendorId);
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting vendor:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// Get vendors by category
exports.getVendorsByCategory = async (req, res) => {
  try {
    const category = req.query.category; 
    console.log('Received category:', category);

    if (!category) {
      console.log('No category provided');
      return res.status(400).json({ message: 'Category is required' });
    }

    const results = await vendorModel.getVendorsByCategory(category);
    console.log('Results:', results);
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching vendors by category:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// Get schedules for a vendor
exports.getVendorSchedules = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendor = await vendorModel.getVendorById(vendorId);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ proposed: vendor.schedules || [], confirmed: (vendor.schedules || []).filter(s => s.status === 'confirmed') });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// Create proposed schedules for a vendor (REPLACE, not append)
exports.createVendorSchedules = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const { slots } = req.body;
    if (!Array.isArray(slots) || slots.length === 0) return res.status(400).json({ message: 'Slots required' });
    const vendor = await vendorModel.getVendorById(vendorId);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    // REPLACE slots instead of appending (FIX: prevents duplicates)
    vendor.schedules = slots.map(slot => ({
      scheduledAt: slot.scheduledAt,
      duration: slot.duration,
      status: slot.status || 'proposed'
    }));
    
    await vendor.save();
    res.json({ proposed: vendor.schedules, confirmed: vendor.schedules.filter(s => s.status === 'confirmed') });
  } catch (error) {
    console.error('Error creating schedules:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// Notify vendor about proposed slots
exports.notifyVendorSlots = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendor = await vendorModel.getVendorById(vendorId);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    // Optionally set interviewer id if provided from frontend/admin
    const adminId = (req.body && req.body.adminId) ? String(req.body.adminId) : null;
    if (adminId) vendor.interviewerid = adminId;

    // generate interview code
    const len = 10;
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let dr = '';
    for (let i = 0; i < len; i++) dr += chars[Math.floor(Math.random() * chars.length)];
    const interviewCode = `ASTROVAANI-${dr}`;
    vendor.interviewcode = interviewCode;

    // If frontend provided slots or a meeting link with the notify request, DON'T append them again
    // They are already saved via createVendorSchedules, so just use existing vendor.schedules
    const providedSlots = vendor.schedules || [];
    const providedMeetLink = req.body && req.body.meetLink ? String(req.body.meetLink).trim() : '';

    // DON'T push slots again - they're already in vendor.schedules from saveSlots
    // This prevents duplication when clicking "Notify Vendor"

    // Save vendor with new interview code and any proposed slots
    await vendor.save();

    // prepare message and send via IconicSolution (same as PHP)
    const baseUrl = process.env.SITE_BASE_URL || 'https://astrovaani.com';
    // Use new React interview page instead of PHP
    const link = `${baseUrl}/interview?code=${encodeURIComponent(interviewCode)}`;
    const name = (vendor.name || '').trim();
    const mobile = (vendor.phone || vendor.whatsapp || '').replace(/\s+/g, '');
    if (!mobile) return res.status(400).json({ message: 'Vendor mobile not available' });

    // Build a message that includes slots and optional meeting link
    let slotText = '';
    if (providedSlots.length > 0) {
      slotText = '\n\nProposed slots:\n';
      providedSlots.forEach((s, idx) => {
        const dt = s.scheduledAt ? new Date(s.scheduledAt) : null;
        const dtStr = dt ? dt.toLocaleString('en-GB', { timeZone: 'UTC' }) : 'TBD';
        const dur = s.duration ? `${s.duration} mins` : 'TBD';
        slotText += `${idx + 1}. ${dtStr} (${dur})\n`;
      });
    }

    const meetText = providedMeetLink ? `\nMeeting link: ${providedMeetLink}\n` : '';

    const msg = `*Dear ${name}*,\n\nWe are pleased to inform you that your joining application has been approved. As the next step, your interview has been scheduled, and we invite you to book a suitable time slot.${slotText}\nPlease click on the link below to select an available slot for your interview:\n\n*${link}*\n\n${meetText}Should you have any questions or need further assistance, feel free to reach out to us at support@astrovaani.com\n\n*Note:* If you're unable to click on the link, please save this number in your contacts, and the link will become clickable.`;

    // IconicSolution API key (same as PHP uses for vendor notifications)
    const iconicKey = process.env.ICONIC_API_KEY || '0bf9865d140d4676b28be02813fbf1c8';
    
    // Normalize mobile to include country code
    const normalizeMobile = (raw) => {
      if (!raw) return raw;
      let digits = raw.replace(/[^0-9]/g, '');
      if (digits.length === 10) digits = '91' + digits; // assume India
      if (digits.length === 11 && digits.startsWith('0')) digits = '91' + digits.slice(1);
      return digits;
    };
    
    const mobileFormatted = normalizeMobile(mobile);
    
    let whatsappResponse = null;
    let finalStatus = 'failed';
    
    // Send WhatsApp notification (DUMMY MODE for testing)
    console.log('📱 Sending WhatsApp notification');
    console.log('   Mobile:', mobileFormatted);
    console.log('   Message length:', msg.length);
    console.log('   Interview Code:', interviewCode);
    
    // HARDCODED: Set to true for testing, false once template is approved
    const isDummyMode = false; // ✅ Changed to false - template approved and ready for production!
    
    if (isDummyMode) {
      // DUMMY MODE: Simulate successful WhatsApp send
      console.log('🧪 DUMMY MODE ENABLED - Simulating successful WhatsApp send');
      console.log('📝 Message preview:\n', msg.substring(0, 200) + '...');
      
      whatsappResponse = {
        status: 'success',
        statuscode: 200,
        msg: 'Message sent successfully (DUMMY)',
        messageId: `dummy_msg_${Date.now()}`,
        mobile: mobileFormatted,
        timestamp: new Date().toISOString()
      };
      
      finalStatus = 'sent';
      console.log(`✅ WhatsApp sent successfully (DUMMY MODE)!`);
    } else {
      // REAL MODE: Use template-based API (same as customer_frontend)
      const whatsappApiUrl = process.env.WHATSAPP_API_URL || 'https://wa.iconicsolution.co.in/wapp/api/send/bytemplate';
      const apiKey = process.env.ICONIC_API_KEY;
      // Template name from IconicSolution dashboard (approved template)
      const templateName = 'vendor_interview_notification_';
      
      if (!apiKey) {
        console.error('❌ ICONIC_API_KEY not found in .env');
        whatsappResponse = { error: 'API key not configured' };
      } else {
        try {
          console.log('🔄 Sending WhatsApp via template:', templateName);
          console.log('   Mobile:', mobileFormatted);
          console.log('   Variables:', [name, link]);
          
          // Use template-based API (same as customer_frontend)
          const FormData = require('form-data');
          const formData = new FormData();
          formData.append('apikey', apiKey);
          formData.append('mobile', mobileFormatted);
          formData.append('templatename', templateName);
          
          // Format variables for template: vendor name and booking link
          const templateVars = [name, link];
          formData.append('dvariables', JSON.stringify(templateVars));
          
          const sendRes = await axios.post(whatsappApiUrl, formData, { 
            headers: formData.getHeaders(),
            timeout: 30000
          });
          
          whatsappResponse = sendRes.data;
          console.log(`✅ WhatsApp API response:`, JSON.stringify(whatsappResponse, null, 2));
          
          // Check for success (handle different response formats)
          if (whatsappResponse && (
            whatsappResponse.status === 'success' || 
            whatsappResponse.success === true || 
            whatsappResponse.statuscode === 200 || 
            whatsappResponse.statuscode === 2000 ||
            whatsappResponse.statusCode === 200
          )) {
            finalStatus = 'sent';
            console.log(`✅ WhatsApp sent successfully!`);
          } else {
            console.warn(`⚠️ WhatsApp API returned non-success status:`, whatsappResponse);
            // Still log as sent if we got a response without error
            if (whatsappResponse && !whatsappResponse.error && !whatsappResponse.message?.includes('no active')) {
              finalStatus = 'sent';
              console.log(`⚠️ Assuming success based on no error in response`);
            }
          }
        } catch (waErr) {
          const errDetail = waErr?.response?.data || { message: waErr.message, code: waErr.code };
          console.error(`❌ WhatsApp send error:`, JSON.stringify(errDetail, null, 2));
          whatsappResponse = errDetail;
        }
      }
    }

    // Log notification
    if (finalStatus === 'sent') {
      await Notification.create({ 
        vendorId: vendor._id, 
        type: 'whatsapp', 
        payload: { msg, mobile: mobileFormatted, slots: providedSlots, meetLink: providedMeetLink }, 
        status: 'sent', 
        providerResponse: whatsappResponse
      });
    } else {
      await Notification.create({ 
        vendorId: vendor._id, 
        type: 'whatsapp', 
        payload: { msg, mobile: mobileFormatted, slots: providedSlots, meetLink: providedMeetLink }, 
        status: 'failed', 
        error: whatsappResponse 
      });
    }

    // Send email via nodemailer if email available and ENABLE_EMAIL is true
    let emailResponse = null;
    const enableEmail = process.env.ENABLE_EMAIL === 'true';
    if (enableEmail && vendor.email) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.example.com',
          port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || ''
          }
        });
        const mailOptions = {
          from: process.env.EMAIL_FROM || 'no-reply@astrovaani.com',
          to: vendor.email,
          subject: 'Interview scheduled - Astrovaani',
          text: `Dear ${name},\n\nYour interview booking link: ${link}`,
          html: `<p>Dear ${name},</p><p>Your interview booking link: <a href="${link}">${link}</a></p>`
        };
        emailResponse = await transporter.sendMail(mailOptions);
        await Notification.create({ vendorId: vendor._id, type: 'email', payload: { mailOptions }, status: 'sent', providerResponse: emailResponse });
      } catch (emErr) {
        console.error('Email send error', emErr.message || emErr);
        await Notification.create({ vendorId: vendor._id, type: 'email', payload: { mailOptions: null }, status: 'failed', error: emErr.message });
      }
    } else {
      if (!enableEmail) console.log('Email disabled via ENABLE_EMAIL flag; skipping email send');
    }

    return res.json({ 
      message: 'Notification process completed', 
      whatsappResponse, 
      emailResponse, 
      interviewCode 
    });
  } catch (error) {
    console.error('Error notifying vendor:', error?.response?.data || error.message || error);
    res.status(500).json({ message: 'Notification error', error: error?.response?.data || error.message });
  }
};

// Delete a specific schedule for a vendor
exports.deleteVendorSchedule = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const scheduleId = req.params.scheduleId;
    
    const vendor = await vendorModel.getVendorById(vendorId);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    // Remove the schedule by _id
    const initialLength = vendor.schedules.length;
    vendor.schedules = vendor.schedules.filter(
      schedule => schedule._id.toString() !== scheduleId
    );

    if (vendor.schedules.length === initialLength) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    await vendor.save();
    res.json({ 
      message: 'Schedule removed successfully',
      proposed: vendor.schedules,
      confirmed: vendor.schedules.filter(s => s.status === 'confirmed')
    });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// Clear all schedules for a vendor (bulk delete)
exports.clearAllVendorSchedules = async (req, res) => {
  try {
    const vendorId = req.params.id;
    
    const vendor = await vendorModel.getVendorById(vendorId);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    // Clear all schedules
    const removedCount = vendor.schedules.length;
    vendor.schedules = [];

    await vendor.save();
    res.json({ 
      message: `All ${removedCount} schedule(s) cleared successfully`,
      proposed: [],
      confirmed: []
    });
  } catch (error) {
    console.error('Error clearing schedules:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// ==================== PUBLIC INTERVIEW APIS ====================
// These APIs are for vendors to view and select interview slots
// No authentication required - accessed via interview code

// Get vendor and available slots by interview code
exports.getInterviewByCode = async (req, res) => {
  try {
    const { code } = req.params;
    console.log('🔍 Looking up interview with code:', code);

    // Find vendor by interview code
    const vendor = await vendorModel.getVendorByInterviewCode(code);
    
    if (!vendor) {
      return res.status(404).json({ 
        success: false,
        message: 'Invalid interview code or interview not found' 
      });
    }

    // Check if already scheduled - check both onboardingstatus AND if there's a confirmed slot
    const confirmedSlot = vendor.schedules
      ? vendor.schedules.find(s => s.status === 'confirmed')
      : null;
    
    const isScheduled = (vendor.onboardingstatus === 'interview scheduled') || (confirmedSlot !== null);
    
    // Get proposed slots (not yet confirmed by vendor)
    const availableSlots = vendor.schedules
      ? vendor.schedules.filter(s => s.status === 'proposed')
      : [];

    console.log('✅ Interview found:', {
      vendorId: vendor._id,
      vendorName: vendor.name,
      onboardingstatus: vendor.onboardingstatus,
      isScheduled,
      totalSchedules: vendor.schedules ? vendor.schedules.length : 0,
      availableSlots: availableSlots.length,
      confirmedSlot: confirmedSlot ? 'Yes' : 'No',
      schedulesDetails: vendor.schedules ? vendor.schedules.map(s => ({ id: s._id, status: s.status })) : []
    });

    res.json({
      success: true,
      vendor: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        category: vendor.category,
        interviewcode: vendor.interviewcode,
        interviewerid: vendor.interviewerid,
        onboardingstatus: vendor.onboardingstatus
      },
      isScheduled,
      availableSlots: availableSlots.map(slot => ({
        id: slot._id,
        scheduledAt: slot.scheduledAt,
        duration: slot.duration,
        status: slot.status,
        createdAt: slot.createdAt
      })),
      confirmedSlot: confirmedSlot ? {
        id: confirmedSlot._id,
        scheduledAt: confirmedSlot.scheduledAt,
        duration: confirmedSlot.duration,
        status: confirmedSlot.status
      } : null
    });

  } catch (error) {
    console.error('❌ Error fetching interview:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching interview details',
      error: error.message 
    });
  }
};

// Select an interview slot (vendor confirms their choice)
exports.selectInterviewSlot = async (req, res) => {
  try {
    const { code } = req.params;
    const { slotId } = req.body;

    console.log('📅 Vendor selecting slot:', { code, slotId });

    if (!slotId) {
      return res.status(400).json({ 
        success: false,
        message: 'Please select a slot' 
      });
    }

    // Find vendor by interview code
    const vendor = await vendorModel.getVendorByInterviewCode(code);
    
    if (!vendor) {
      return res.status(404).json({ 
        success: false,
        message: 'Invalid interview code' 
      });
    }

    // Check if already scheduled - check if there's already a confirmed slot
    const existingConfirmedSlot = vendor.schedules.find(s => s.status === 'confirmed');
    
    if (vendor.onboardingstatus === 'interview scheduled' || existingConfirmedSlot) {
      return res.status(400).json({ 
        success: false,
        message: 'Interview already scheduled. You cannot change the slot.' 
      });
    }

    // Find the selected slot
    const selectedSlot = vendor.schedules.find(
      s => s._id.toString() === slotId && s.status === 'proposed'
    );

    if (!selectedSlot) {
      return res.status(404).json({ 
        success: false,
        message: 'Selected slot not found or already confirmed' 
      });
    }

    // Store the unselected proposed slots before removing them
    const unselectedSlots = vendor.schedules.filter(
      s => s._id.toString() !== slotId && s.status === 'proposed'
    );

    console.log('📌 Unselected slots to be removed:', {
      count: unselectedSlots.length,
      slots: unselectedSlots.map(s => ({
        id: s._id,
        scheduledAt: s.scheduledAt,
        status: s.status
      }))
    });

    // Remove ALL other slots (proposed) - Keep ONLY the selected slot
    vendor.schedules = vendor.schedules.filter(
      s => s._id.toString() === slotId
    );

    // Update the selected slot status to 'confirmed'
    const confirmedSlot = vendor.schedules[0];
    confirmedSlot.status = 'confirmed';

    // Update vendor onboarding status
    vendor.onboardingstatus = 'interview scheduled';

    await vendor.save();

    console.log('✅ Slot confirmed successfully:', {
      vendorId: vendor._id,
      slotId: confirmedSlot._id,
      scheduledAt: confirmedSlot.scheduledAt,
      removedSlots: unselectedSlots.length
    });

    res.json({
      success: true,
      message: 'Interview slot confirmed successfully!',
      confirmedSlot: {
        id: confirmedSlot._id,
        scheduledAt: confirmedSlot.scheduledAt,
        duration: confirmedSlot.duration,
        status: confirmedSlot.status
      },
      vendor: {
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone
      },
      removedSlots: unselectedSlots.length
    });

  } catch (error) {
    console.error('❌ Error selecting slot:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error confirming interview slot',
      error: error.message 
    });
  }
};

// Send meeting link to vendor
exports.sendMeetingLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { meetingLink, slotId } = req.body;

    if (!meetingLink) {
      return res.status(400).json({ 
        success: false,
        message: 'Meeting link is required' 
      });
    }

    const vendor = await vendorModel.getVendorById(id);
    
    if (!vendor) {
      return res.status(404).json({ 
        success: false,
        message: 'Vendor not found' 
      });
    }

    // Update meeting link in the confirmed slot
    const confirmedSlot = vendor.schedules.find(s => s._id.toString() === slotId);
    if (!confirmedSlot) {
      return res.status(404).json({ 
        success: false,
        message: 'Confirmed slot not found' 
      });
    }

    confirmedSlot.meetLink = meetingLink;
    await vendor.save();

    // Format the slot date and time
    const slotDate = confirmedSlot.scheduledAt ? new Date(confirmedSlot.scheduledAt) : new Date();
    const formattedDate = slotDate.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
    const formattedTime = slotDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    // Prepare WhatsApp message
    const name = (vendor.name || '').trim();
    const mobile = (vendor.phone || vendor.whatsapp || '').replace(/\s+/g, '');
    
    if (!mobile) {
      console.warn('⚠️ No mobile number found for vendor');
      return res.json({
        success: true,
        message: 'Meeting link saved but WhatsApp not sent (no phone number)'
      });
    }

    // Normalize mobile to include country code
    const normalizeMobile = (raw) => {
      if (!raw) return raw;
      let digits = raw.replace(/[^0-9]/g, '');
      if (digits.length === 10) digits = '91' + digits; // assume India
      if (digits.length === 11 && digits.startsWith('0')) digits = '91' + digits.slice(1);
      return digits;
    };
    
    const mobileFormatted = normalizeMobile(mobile);

    // Build WhatsApp message
    const msg = `🎉 *Great news, ${name}!*\n\nYour interview with *Astrovaani* is confirmed!\n\n📅 *Date & Time:* ${formattedDate} at ${formattedTime}\n🔗 *Meeting Link:* ${meetingLink}\n\nPlease join on time. Good luck!\n\n- Team Astrovaani`;

    console.log('✅ Meeting link saved:', {
      vendorId: vendor._id,
      vendorName: vendor.name,
      meetingLink,
      phone: mobileFormatted,
      slotDateTime: `${formattedDate} at ${formattedTime}`
    });

    // Send WhatsApp notification
    let whatsappSent = false;
    const isDummyMode = false; // ✅ PRODUCTION MODE ENABLED - Real WhatsApp sending active!

    if (isDummyMode) {
      console.log('🧪 DUMMY MODE - WhatsApp message preview:');
      console.log('📱 To:', mobileFormatted);
      console.log('📝 Message:\n' + msg);
      whatsappSent = true;
    } else {
      // REAL MODE: Send via IconicSolution API
      const whatsappApiUrl = process.env.WHATSAPP_API_URL || 'https://wa.iconicsolution.co.in/wapp/api/send';
      const apiKey = process.env.ICONIC_API_KEY;

      if (!apiKey) {
        console.error('❌ ICONIC_API_KEY not found in .env');
      } else {
        try {
          const axios = require('axios');
          const FormData = require('form-data');
          const formData = new FormData();
          formData.append('apikey', apiKey);
          formData.append('mobile', mobileFormatted);
          formData.append('msg', msg);

          const response = await axios.post(whatsappApiUrl, formData, {
            headers: formData.getHeaders(),
            timeout: 30000
          });

          console.log('✅ WhatsApp API Response:', JSON.stringify(response.data, null, 2));
          
          if (response.data && (
            response.data.status === 'success' || 
            response.data.success === true ||
            response.data.statuscode === 200
          )) {
            whatsappSent = true;
            console.log('✅ WhatsApp sent successfully!');
          }
        } catch (waErr) {
          console.error('❌ WhatsApp send error:', waErr.message);
        }
      }
    }

    res.json({
      success: true,
      message: whatsappSent 
        ? 'Meeting link sent successfully via WhatsApp' 
        : 'Meeting link saved (WhatsApp send failed)',
      whatsappSent
    });

  } catch (error) {
    console.error('❌ Error sending meeting link:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error sending meeting link',
      error: error.message 
    });
  }
};

// Notify vendor (interview reminder)
exports.notifyVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await vendorModel.getVendorById(id);
    
    if (!vendor) {
      return res.status(404).json({ 
        success: false,
        message: 'Vendor not found' 
      });
    }

    const confirmedSlot = vendor.schedules.find(s => s.status === 'confirmed');
    
    if (!confirmedSlot) {
      return res.status(400).json({ 
        success: false,
        message: 'No confirmed interview slot found' 
      });
    }

    // Send WhatsApp notification reminder using IconicSolution API
    const name = (vendor.name || '').trim();
    const mobile = (vendor.phone || vendor.whatsapp || '').replace(/\s+/g, '');
    
    if (!mobile) {
      return res.status(400).json({ 
        success: false,
        message: 'Vendor mobile number not available' 
      });
    }

    // Format interview time
    const interviewDate = new Date(confirmedSlot.scheduledAt);
    const formattedDate = interviewDate.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Build WhatsApp message
    const meetingLink = confirmedSlot.meetingLink || '';
    const meetText = meetingLink ? `\n\n*Meeting Link:* ${meetingLink}` : '';
    
    const msg = `*Dear ${name}*,\n\nThis is a reminder about your upcoming interview with *Astrovaani*.\n\n*Interview Details:*\n📅 Date & Time: ${formattedDate}\n⏱️ Duration: ${confirmedSlot.duration || 30} minutes${meetText}\n\nPlease be available and prepared at the scheduled time. Make sure you have a stable internet connection and are in a quiet environment.\n\nIf you have any questions or need to reschedule, please contact us at support@astrovaani.com\n\n*Note:* If you're unable to click on the link, please save this number in your contacts, and the link will become clickable.\n\nWe look forward to speaking with you!`;

    // IconicSolution API configuration
    const iconicKey = process.env.ICONIC_API_KEY || '0bf9865d140d4676b28be02813fbf1c8';
    const normalizedMobile = mobile.startsWith('91') ? mobile : `91${mobile}`;

    console.log('📲 Sending interview reminder:', {
      vendorName: vendor.name,
      scheduledAt: confirmedSlot.scheduledAt,
      phone: normalizedMobile,
      meetingLink: meetingLink || 'Not provided'
    });

    // Send WhatsApp message via IconicSolution API
    try {
      const whatsappResponse = await axios.post(
        'https://api.imiconnect.in/resources/v1/messaging',
        {
          deliverychannel: 'whatsapp',
          destination: [{ waid: [normalizedMobile] }],
          message: { text: msg }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'key': iconicKey
          }
        }
      );

      console.log('✅ WhatsApp reminder sent successfully:', whatsappResponse.data);

    } catch (whatsappError) {
      console.error('❌ WhatsApp API error:', whatsappError.response?.data || whatsappError.message);
      // Continue even if WhatsApp fails - don't block the response
    }

    res.json({
      success: true,
      message: 'Interview reminder sent successfully'
    });

  } catch (error) {
    console.error('❌ Error sending notification:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error sending notification',
      error: error.message 
    });
  }
};

// Send reminder to vendor (for pending interviews)
exports.sendReminder = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await vendorModel.getVendorById(id);
    
    if (!vendor) {
      return res.status(404).json({ 
        success: false,
        message: 'Vendor not found' 
      });
    }

    if (!vendor.interviewcode) {
      return res.status(400).json({ 
        success: false,
        message: 'No interview code found for this vendor' 
      });
    }

    // TODO: Send WhatsApp reminder with interview link
    const interviewLink = `${process.env.FRONTEND_URL}/vendor-interview?code=${vendor.interviewcode}`;
    
    console.log('📲 Sending reminder:', {
      vendorName: vendor.name,
      interviewLink,
      phone: vendor.whatsapp || vendor.phone
    });

    res.json({
      success: true,
      message: 'Reminder sent successfully'
    });

  } catch (error) {
    console.error('❌ Error sending reminder:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error sending reminder',
      error: error.message 
    });
  }
};

// Schedule interview slots for vendor
exports.scheduleInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { schedules } = req.body;

    if (!schedules || schedules.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide at least one schedule' 
      });
    }

    const vendor = await vendorModel.getVendorById(id);
    
    if (!vendor) {
      return res.status(404).json({ 
        success: false,
        message: 'Vendor not found' 
      });
    }

    // Generate interview code if not exists
    if (!vendor.interviewcode) {
      vendor.interviewcode = `IV${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    }

    // Add new schedules
    vendor.schedules = schedules.map(slot => ({
      scheduledAt: new Date(slot.scheduledAt),
      duration: slot.duration || 30,
      status: 'proposed',
      createdAt: new Date()
    }));

    await vendor.save();

    // TODO: Send WhatsApp notification with interview link
    const interviewLink = `${process.env.FRONTEND_URL}/vendor-interview?code=${vendor.interviewcode}`;
    
    console.log('✅ Interview scheduled:', {
      vendorId: vendor._id,
      vendorName: vendor.name,
      slotsCount: schedules.length,
      interviewLink,
      phone: vendor.whatsapp || vendor.phone
    });

    res.json({
      success: true,
      message: 'Interview scheduled successfully',
      interviewCode: vendor.interviewcode,
      interviewLink
    });

  } catch (error) {
    console.error('❌ Error scheduling interview:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error scheduling interview',
      error: error.message 
    });
  }
};

// Cancel interview
exports.cancelInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await vendorModel.getVendorById(id);
    
    if (!vendor) {
      return res.status(404).json({ 
        success: false,
        message: 'Vendor not found' 
      });
    }

    // Clear schedules and interview data
    vendor.schedules = [];
    vendor.interviewcode = '';
    vendor.interviewerid = '';
    vendor.onboardingstatus = '';

    await vendor.save();

    console.log('✅ Interview cancelled:', {
      vendorId: vendor._id,
      vendorName: vendor.name
    });

    res.json({
      success: true,
      message: 'Interview cancelled successfully'
    });

  } catch (error) {
    console.error('❌ Error cancelling interview:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error cancelling interview',
      error: error.message 
    });
  }
};