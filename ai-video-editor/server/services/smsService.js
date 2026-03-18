const crypto = require('crypto');

class SMSService {
  constructor(options = {}) {
    this.provider = options.provider || 'mock';
    this.config = options.config || {};
    
    // SMS code storage (in production, use Redis)
    this.codes = new Map();
    
    // Cleanup expired codes every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Generate verification code
   */
  generateCode(length = 6) {
    const code = crypto.randomInt(Math.pow(10, length - 1), Math.pow(10, length) - 1).toString();
    return code.padStart(length, '0');
  }

  /**
   * Send verification code
   */
  async sendCode(phone, type = 'login') {
    const code = this.generateCode();
    
    // Store code with expiration (5 minutes)
    const key = `${type}:${phone}`;
    this.codes.set(key, {
      code,
      expires: Date.now() + 5 * 60 * 1000,
      attempts: 0
    });
    
    // In production, integrate with actual SMS provider
    if (this.provider === 'mock') {
      console.log(`[SMS Mock] 验证码: ${code} -> ${phone}`);
      return {
        success: true,
        message: '验证码已发送',
        mock: true
      };
    }
    
    // Aliyun SMS
    if (this.provider === 'aliyun') {
      return this.sendAliyun(phone, code, type);
    }
    
    // Tencent SMS
    if (this.provider === 'tencent') {
      return this.sendTencent(phone, code, type);
    }
    
    // Submail
    if (this.provider === 'submail') {
      return this.sendSubmail(phone, code, type);
    }
    
    return { success: false, message: '未配置的短信服务商' };
  }

  /**
   * Verify code
   */
  async verifyCode(phone, code, type = 'login') {
    const key = `${type}:${phone}`;
    const stored = this.codes.get(key);
    
    if (!stored) {
      return { success: false, message: '请先获取验证码' };
    }
    
    if (Date.now() > stored.expires) {
      this.codes.delete(key);
      return { success: false, message: '验证码已过期，请重新获取' };
    }
    
    if (stored.attempts >= 5) {
      return { success: false, message: '验证码尝试次数过多，请重新获取' };
    }
    
    if (stored.code !== code) {
      stored.attempts++;
      return { success: false, message: '验证码错误' };
    }
    
    // Success - delete code
    this.codes.delete(key);
    return { success: true, message: '验证成功' };
  }

  /**
   * Aliyun SMS (mock implementation)
   */
  async sendAliyun(phone, code, type) {
    const templates = {
      'login': this.config.templateCode || 'SMS_123456789',
      'bind': this.config.templateCode || 'SMS_123456789',
      'reset': this.config.templateCode || 'SMS_123456789'
    };
    
    try {
      // In production, use @alicloud/dysmsapi
      console.log(`[Aliyun SMS] Sending to ${phone}, code: ${code}`);
      
      return {
        success: true,
        message: '发送成功'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Tencent SMS (mock implementation)
   */
  async sendTencent(phone, code, type) {
    try {
      console.log(`[Tencent SMS] Sending to ${phone}, code: ${code}`);
      
      return {
        success: true,
        message: '发送成功'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Submail SMS (mock implementation)
   */
  async sendSubmail(phone, code, type) {
    try {
      console.log(`[Submail SMS] Sending to ${phone}, code: ${code}`);
      
      return {
        success: true,
        message: '发送成功'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Cleanup expired codes
   */
  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.codes.entries()) {
      if (now > value.expires) {
        this.codes.delete(key);
      }
    }
  }

  /**
   * Send notification SMS
   */
  async sendNotification(phone, template, params = {}) {
    if (this.provider === 'mock') {
      console.log(`[SMS Mock] Notification to ${phone}:`, params);
      return { success: true };
    }
    
    // Implement based on provider
    return { success: true };
  }

  /**
   * Get balance (for paid providers)
   */
  async getBalance() {
    if (this.provider === 'mock') {
      return { balance: 1000, unit: '条' };
    }
    
    return { balance: 0, unit: '条' };
  }
}

module.exports = SMSService;
