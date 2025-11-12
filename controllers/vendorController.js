const vendorModel = require('../models/vendorModel');
const axios = require('axios');
const Notification = require('../models/notificationModel');
const nodemailer = require('nodemailer');
const { sendWhatsApp } = require('../utils/whatsappService');
 
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
    const link = `${baseUrl}/schedule_interview.php?interviewcode=${encodeURIComponent(interviewCode)}`;
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
    
    // Send WhatsApp using IconicSolution (matching PHP implementation exactly)
    console.log('📱 Sending WhatsApp via IconicSolution');
    console.log('   Mobile:', mobileFormatted);
    console.log('   Message length:', msg.length);
    
    // IMPORTANT: Use HTTPS endpoint (PHP uses HTTPS, not HTTP!)
    const sendUrl = 'https://api.iconicsolution.co.in/wapp/v2/api/send';
    
    try {
      // Use URLSearchParams to match PHP's CURLOPT_POSTFIELDS behavior
      const params = new URLSearchParams();
      params.append('apikey', iconicKey);
      params.append('mobile', mobileFormatted);
      params.append('msg', msg);
      
      const sendRes = await axios.post(sendUrl, params.toString(), { 
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 15000
      });
      
      whatsappResponse = sendRes.data;
      console.log(`✅ WhatsApp API response:`, whatsappResponse);
      
      // Check for success
      if (whatsappResponse && (whatsappResponse.status === 'success' || whatsappResponse.success === true || whatsappResponse.statuscode === 200 || whatsappResponse.statuscode === 2000)) {
        finalStatus = 'sent';
        console.log(`✅ WhatsApp sent successfully!`);
      } else {
        console.warn(`⚠️ WhatsApp API returned non-success status:`, whatsappResponse);
      }
    } catch (waErr) {
      const errDetail = waErr?.response?.data || { message: waErr.message, code: waErr.code };
      console.error(`❌ WhatsApp send error:`, errDetail);
      whatsappResponse = errDetail;
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