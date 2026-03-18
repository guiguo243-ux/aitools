import Taro from '@tarojs/taro'
import request from './request'

export interface PayOrder {
  orderId: string
  amount: number
  planType: 'month' | 'quarter' | 'year'
}

export interface PayResult {
  success: boolean
  orderId: string
}

export const createVipOrder = async (planType: 'month' | 'quarter' | 'year'): Promise<PayOrder> => {
  try {
    const res = await request.post('/order/vip', { planType })
    if (res.code === 200) {
      return res.data
    }
    throw new Error(res.message || '创建订单失败')
  } catch (error) {
    console.error('Create order error:', error)
    throw error
  }
}

export const requestPayment = async (orderId: string): Promise<PayResult> => {
  try {
    const res = await request.post(`/pay/prepare`, { orderId })
    if (res.code !== 200) {
      throw new Error(res.message || '支付准备失败')
    }

    const payData = res.data
    
    return new Promise((resolve, reject) => {
      (Taro as any).requestPayment({
        timeStamp: payData.timeStamp,
        nonceStr: payData.nonceStr,
        package: payData.package,
        signType: payData.signType || 'MD5',
        paySign: payData.paySign,
        success: (result: any) => {
          resolve({ success: true, orderId })
        },
        fail: (err: any) => {
          console.error('Payment failed:', err)
          resolve({ success: false, orderId })
        }
      })
    })
  } catch (error) {
    console.error('Payment error:', error)
    throw error
  }
}

export const buyVip = async (planType: 'month' | 'quarter' | 'year'): Promise<boolean> => {
  try {
    Taro.showLoading({ title: '创建订单...' })
    
    const order = await createVipOrder(planType)
    
    Taro.hideLoading()
    
    const result = await requestPayment(order.orderId)
    
    if (result.success) {
      Taro.showToast({ title: '支付成功', icon: 'success' })
      return true
    } else {
      Taro.showToast({ title: '支付取消', icon: 'none' })
      return false
    }
  } catch (error) {
    Taro.hideLoading()
    Taro.showToast({ title: '支付失败', icon: 'none' })
    return false
  }
}

export const checkPaymentStatus = async (orderId: string): Promise<boolean> => {
  try {
    const res = await request.get(`/order/${orderId}/status`)
    return res.data?.status === 'paid'
  } catch (error) {
    console.error('Check payment status error:', error)
    return false
  }
}
