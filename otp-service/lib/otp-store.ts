import Redis from 'ioredis'

export interface OTPData {
  otp: string
  phoneNumber: string
  attempts: number
  createdAt: Date
  expiresAt: Date
}

export class OTPStore {
  private redis: Redis
  private OTP_TTL = 300 // 5 minutes
  private MAX_ATTEMPTS = 3

  constructor(redisUrl?: string) {
    this.redis = new Redis(redisUrl || process.env.REDIS_URL || 'redis://localhost:6379')
  }

  private generateOTP(length: number = 6): string {
    return Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0')
  }

  async create(phoneNumber: string): Promise<string> {
    const otp = this.generateOTP()
    const key = `otp:${phoneNumber}`
    
    const existingData = await this.redis.get(key)
    if (existingData) {
      const data = JSON.parse(existingData) as OTPData
      const timeSinceCreated = Date.now() - new Date(data.createdAt).getTime()
      
      // Rate limiting: prevent creating new OTP within 60 seconds
      if (timeSinceCreated < 60000) {
        throw new Error('Please wait 60 seconds before requesting a new OTP')
      }
    }

    const otpData: OTPData = {
      otp,
      phoneNumber,
      attempts: 0,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.OTP_TTL * 1000)
    }

    await this.redis.setex(key, this.OTP_TTL, JSON.stringify(otpData))
    
    return otp
  }

  async verify(phoneNumber: string, otp: string): Promise<boolean> {
    const key = `otp:${phoneNumber}`
    const data = await this.redis.get(key)
    
    if (!data) {
      throw new Error('OTP expired or not found')
    }

    const otpData = JSON.parse(data) as OTPData
    
    if (otpData.attempts >= this.MAX_ATTEMPTS) {
      await this.redis.del(key)
      throw new Error('Maximum verification attempts exceeded')
    }

    otpData.attempts += 1
    await this.redis.setex(key, this.OTP_TTL, JSON.stringify(otpData))

    if (otpData.otp === otp) {
      await this.redis.del(key) // Delete on successful verification
      return true
    }

    if (otpData.attempts >= this.MAX_ATTEMPTS) {
      await this.redis.del(key)
      throw new Error('Maximum verification attempts exceeded')
    }

    return false
  }

  async getOTPData(phoneNumber: string): Promise<OTPData | null> {
    const key = `otp:${phoneNumber}`
    const data = await this.redis.get(key)
    
    if (!data) {
      return null
    }

    return JSON.parse(data) as OTPData
  }

  async delete(phoneNumber: string): Promise<void> {
    const key = `otp:${phoneNumber}`
    await this.redis.del(key)
  }

  async close(): Promise<void> {
    await this.redis.quit()
  }
}