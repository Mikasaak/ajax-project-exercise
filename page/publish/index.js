/**
 * 目标1：设置频道下拉菜单
 *  1.1 获取频道列表数据
 *  1.2 展示到下拉菜单中
 */

function renderChannelList() {
    // const res = await axios({url:'/v1_0/channels'})
    axios({url:'/v1_0/channels'}).then(res=>{
        const ChannelList = res.data.data.channels
        const ChannelListStr = ChannelList.map(val=>{
            return`<option value="${val.id}">${val.name}</option>`
        }).join('\n')
        // console.log(ChannelListStr)
        document.querySelector('.form-select').innerHTML = '<option value="" selected="">请选择文章频道</option>' + ChannelListStr
    })
    // console.log(res.data.data.channels)
    // const ChannelList = res.data.data.channels
    // const ChannelListStr = ChannelList.map(val=>{
    //     return`<option value="${val.id}">${val.name}</option>`
    // }).join('\n')
    // // console.log(ChannelListStr)
    // document.querySelector('.form-select').innerHTML = '<option value="" selected="">请选择文章频道</option>' + ChannelListStr
}

renderChannelList()
/**
 * 目标2：文章封面设置
 *  2.1 准备标签结构和样式
 *  2.2 选择文件并保存在 FormData
 *  2.3 单独上传图片并得到图片 URL 网址
 *  2.4 回显并切换 img 标签展示（隐藏 + 号上传标签）
 *
 */

const img = document.querySelector('.rounded')
const place = document.querySelector('.place')
const imgInput = document.querySelector('.img-file')
imgInput.addEventListener('change',async function(){
    // console.log(this.files[0])
    const file = this.files[0]
    const data = new FormData()
    data.append('image',file)
    const res = await axios({url:'/v1_0/upload',method:'post',data})
    console.log(res.data.data.url)
    img.src = res.data.data.url
    img.classList.add('show')
    place.classList.add('hide')
})
img.addEventListener('click',()=>{
    imgInput.click()
})
/**
 * 目标3：发布文章保存
 *  3.1 基于 form-serialize 插件收集表单数据对象
 *  3.2 基于 axios 提交到服务器保存
 *  3.3 调用 Alert 警告框反馈结果给用户
 *  3.4 重置表单并跳转到列表页
 */

const form = document.querySelector('.art-form')
document.querySelector('.send').addEventListener('click',async ()=>{
    let formData = serialize(form,{hash:true,empty:true})
    formData.cover= {
        type :1,
        images:[img.src]
    }
    console.log(formData)
    try {
        const res = await axios({
            url:'/v1_0/mp/articles',
            method: 'post',
            data: formData
        })
        console.log('res',res)
        myAlert(true,'发布成功')
        //重置表单
        form.reset()
        img.src = res.data.data.url
        img.classList.remove('show')
        place.classList.remove('hide')
        editor.setHtml('')
        setTimeout(()=>{
            location.assign('../content/index.html')
        },1500)

    } catch (err){
        myAlert(false,err.response.data.message)
        console.log(err)
    }

})


/**
 * 目标4：编辑-回显文章
 *  4.1 页面跳转传参（URL 查询参数方式）
 *  4.2 发布文章页面接收参数判断（共用同一套表单）
 *  4.3 修改标题和按钮文字
 *  4.4 获取文章详情数据并回显表单
 */

/**
 * 目标5：编辑-保存文章
 *  5.1 判断按钮文字，区分业务（因为共用一套表单）
 *  5.2 调用编辑文章接口，保存信息到服务器
 *  5.3 基于 Alert 反馈结果消息给用户
 */