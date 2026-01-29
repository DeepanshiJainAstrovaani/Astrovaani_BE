const mongoose = require('mongoose');

const vendorAgreementSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        default: `<div class="container-fluid basebox white">
        <div class="col s12 m12 l12 xl12 white" id="agreementbox" style="height:auto;padding:40px 80px;">
            <img src="./agreement_files/logo_dark.png" width="180px" alt="Astrovaani logo">
            <p>This Vendor Agreement ("Agreement") is entered into on <b>20 November 2025</b>, by and between <b>Astrovaani</b>, a company
                    located at K2/10A Top Floor, Budh Vihar, New Delhi, 110086 and <b>Neeraj gunwant</b> ("Vendor"), who is registered with mobile number - <b>9368005814</b> and email id - <b>neerajgunwant19@gmail.com</b> , is providing service here
                    . The terms outlined below set forth the responsibilities, rights, and obligations of both
                    parties in the provision of astrology consultation services via Astrovaani's platform. Here, "Astrology" stands for both Astrology service, Tarot Reading and Numerology.
            </p>

            <p><b>1. Services</b><br>
                The Vendor agrees to provide astrology consultation services to clients through the Astrovaani platform,
                or any other methods agreed upon by both parties in writing. The services must adhere to the following
                conditions:<br>
            </p><ul>
                <li>Quality of Service: The Vendor must deliver professional, insightful, and accurate astrology
                    consultations to clients.</li>
                <li>Service Delivery: Consultations can be conducted via live chat or live call as
                    specified by the client. The Vendor is responsible for ensuring timely and responsive communication
                    throughout the consultation process.</li>
                <li>Scope of Services: The services may include, but are not limited to, horoscope readings, tarot card
                    interpretations, numerology consultations, palmistry, and personalized astrology reports.</li>
                <li>Client Satisfaction: The Vendor must strive to maintain high levels of client satisfaction and
                    professionalism. Complaints or disputes must be addressed promptly, and Astrovaani reserves the
                    right to intervene where necessary.</li>
            </ul>
            <p></p>
            <p><b>2. Compensation</b><br>
                Astrovaani agrees to compensate the Vendor for services rendered, according to the following
                terms:<br>
            </p><ul>
                <li>Commission Structure: Vendors retain 80% of the consultation fee for each paid session, while Astrovaani retains a 20% platform fee to cover operational and service costs.</li>
              <li>Complimentary Promotional Bookings: Upon onboarding, every month 10 complimentary bookings will be credited to your account to enhance your profile's visibility. These sessions are unpaid and excluded from revenue share calculations.</li>  
              <li>Payment Schedule: Payments will be made on weekly basis. Payment will be initiated by the end of week which will take 1-2 business days to reflect in your bank account.</li>
                <li>Deductions and Taxes: Astrovaani reserves the right to deduct applicable taxes or fees from the
                    Vendor's payment, in accordance with local tax laws and regulations if applicable.</li>
                <li>Payment Methods: Payments will be made via [Payment Method  e.g., bank transfer, PayPal, etc.]. The
                    Vendor is responsible for ensuring that Astrovaani has the correct payment details on file.</li>
            </ul>
            <p></p>
            <p><b>3. Confidentiality</b><br>
                The Vendor agrees to maintain the confidentiality of all proprietary and sensitive information that is
                disclosed to them by Astrovaani, its clients, or third parties during the course of their engagement.
                This includes, but is not limited to:<br>
            </p><ul>
                <li>Client Information: The Vendor must not disclose any personal, financial, or consultation details of
                    Astrovaani's clients to any third party. NO PERSONAL CALLS/SHARING NUMBERS OR CONNECTION TO BE MADE
                    WITH THE CLIENT. If, found strict LEGAL Action to be taken against the Vendor with immediate effect.
                </li>
                <li>Business Information: Any business plans, marketing strategies, proprietary technologies, or other
                    sensitive operational details about Astrovaani must be kept confidential.</li>
                <li>Duration of Obligation: The obligation to maintain confidentiality remains in effect even after the
                    termination of this agreement, for a period of 3 months or indefinitely, as per applicable law.</li>
                <li>Consequences of Breach: Any breach of confidentiality may result in immediate termination of this
                    Agreement and may subject the Vendor to legal consequences, including damages and injunctive relief.
                </li>
            </ul>
            <p></p>
            <p><b>4. Term and Termination</b><br>
                This Agreement will commence on 20 November 2025 and will remain in effect until terminated by either party
                under the following conditions:<br>
            </p><ul>
                <li>Termination with Notice: Either party may terminate this Agreement by providing 30 days' written
                    notice to the other party. The notice must be delivered via neerajgunwant19@gmail.com.</li>
                <li>Immediate Termination: Astrovaani reserves the right to terminate this Agreement immediately under
                    the following circumstances:
                    <ul class="inul">
                        <li>Breach of any term or condition outlined in this Agreement.</li>
                        <li>Misconduct or unethical behavior during the provision of services.</li>
                        <li>Any actions that may harm Astrovaani's reputation or business.</li>
                    </ul>
                </li>
                <li>Post-Termination Obligations: Upon termination, the Vendor must cease providing services and return
                    all confidential information to Astrovaani. The Vendor will still be entitled to payment for any
                    services rendered prior to the termination date.</li>
            </ul>
            <p></p>
            <p><b>5. Compliance with Laws</b><br>
                The Vendor is responsible for ensuring full compliance with all applicable laws and regulations,
                including but not limited to:<br>
            </p><ul>
                <li>Local and National Laws: The Vendor must comply with the laws governing astrology services, online
                    consultations, taxation, and business operations in their jurisdiction.</li>
                <li>Data Protection Laws: The Vendor agrees to follow relevant data protection and privacy laws, such as
                    the General Data Protection Regulation (GDPR), if applicable.</li>
                <li>Licensing and Certification: If required by local law, the Vendor is responsible for maintaining
                    valid
                    certifications or licenses to practice astrology.
                    Failure to comply with applicable laws may result in immediate termination of this Agreement and may
                    subject the Vendor to legal consequences.</li>
            </ul>
            <p></p>
            <p><b>6. Governing Law</b><br>
                This Agreement shall be governed by and construed in accordance with the laws of India/Delhi. Any
                disputes arising out of or in connection with this Agreement shall be resolved under the exclusive
                jurisdiction of the courts in Delhi High Court.

            </p>
            <p><b>7. Dispute Resolution</b><br>
                In the event of any dispute arising out of or related to this Agreement, the parties agree to first
                attempt to resolve the issue through good-faith negotiations. If the dispute cannot be resolved amicably
                within 15 Days, the parties agree to resolve the matter through mediation or arbitration, as
                follows:<br>
            </p><ul>
                <li>Mediation/Arbitration Procedure: The parties shall select a neutral third-party mediator/arbitrator
                    from a recognized mediation or arbitration body. The decision of the arbitrator will be binding on
                    both
                    parties.</li>
                <li>Venue: The mediation/arbitration proceedings shall take place in Delhi, India or via online
                    arbitration methods, as mutually agreed upon.</li>
            </ul>
            <p></p>
            <p><b>8. Entire Agreement</b><br>
                This Agreement constitutes the entire understanding between Astrovaani and the Vendor and supersedes all
                prior agreements, understandings, and communications, whether written or oral, related to the subject
                matter.<br>
                <br>IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date first written above.
            </p>
            <br><br>
            <div class="signbox"><br>

                <span class="vendor" style="line-height:15px;font-size:18px;">Neeraj gunwant</span>&nbsp;
                <span class="vendor" style="line-height:15px;font-size:16px;">(Astrologer)</span><br>
                <span class="date" style="margin-top:1vh;line-height:25px;">20 November 2025</span>
            </div>

        </div>
    </div>`
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: String,
        default: 'Admin'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('VendorAgreement', vendorAgreementSchema);
