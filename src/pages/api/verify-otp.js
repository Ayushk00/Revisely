// pages/api/verifyOtp.js
import connectToDatabase from '../../lib/mongodb';
import PendingUser from '../../models/PendingUser';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  try {
    await connectToDatabase();

    // 1) Fetch the pending OTP record
    const pending = await PendingUser.findOne({ email });
    if (!pending) {
      return res.status(400).json({ error: 'No OTP pending for this email' });
    }

    // 2) Check expiry
    if (pending.expires < Date.now()) {
      await PendingUser.deleteOne({ email });
      return res.status(400).json({ error: 'OTP expired' });
    }

    // 3) Validate code
    if (pending.code !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // 4) OTP is valid → delete and return success
    await PendingUser.deleteOne({ email });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error in verifyOtp:', err);
    return res.status(500).json({ error: 'Failed to verify OTP' });
  }
}
