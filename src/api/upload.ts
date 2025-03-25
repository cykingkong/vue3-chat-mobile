import request from '@/utils/request'

export async function uploadFile(data): Promise<any> {
    return request.put('/kfapi/tool/upload',data)
  }