/**
 * Created by jerry on 2017/11/13.
 * 图书相关api
 */
import * as API from './'

export default {

  //查询获取book列表(通过page分页)
  findList: params => {
    return API.POST('/api/v1/users/getSDKList', params)
  },
  //文件上传
  uploadFile: params => {
    return API.POST('/api/v1/sdk/sdkUpload', params)
  },
  //查询获取一条book信息
  findById: id => {
    return API.GET(`/api/v1/books/${id}`)
  },

  add: params => {
    return API.POST(`/api/v1/sdk/addSDK`, params)
  },
  // update: (id, params) => {
  //   return API.PUT(`/api/v1/books/${id}`, params)
  // },
  update: (params) => {
    return API.POST(`/api/v1/sdk/updateSDK`, params)
  },

  //单个删除book
  remove: params => {
    // return API.GET(`/api/v1/sdk/deleteSDK/${id}`)
    return API.POST(`/api/v1/sdk/deleteSDK`,params)
  },

  //批量删除，传ids数组
  removeBatch: (ids) => {
    return API.DELETE(`/api/v1/books/batch/${ids}`)
  }

}
