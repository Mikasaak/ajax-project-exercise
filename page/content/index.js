/**
 * 目标1：获取文章列表并展示
 *  1.1 准备查询参数对象
 *  1.2 获取文章列表数据
 *  1.3 展示到指定的标签结构中
 */
function renderChannelList() {
    // const res = await axios({url:'/v1_0/channels'})
    axios({url: '/v1_0/channels'}).then(res => {
        const ChannelList = res.data.data.channels
        const ChannelListStr = ChannelList.map(val => {
            return `<option value="${val.id}">${val.name}</option>`
        }).join('\n')
        // console.log(ChannelListStr)
        document.querySelector('.form-select').innerHTML = '<option value="" selected="selected">请选择文章频道</option>' + ChannelListStr
    })
}

renderChannelList()
// import {renderChannelList} from "../publish/index.js";//import导入的js文件会先运行一次，之后的导入语句不再从头运行js文件
// renderChannelList()

/*
 * 目标2：筛选文章列表
 *  2.1 设置频道列表数据
 *  2.2 监听筛选条件改变，保存查询信息到查询参数对象
 *  2.3 点击筛选时，传递查询参数对象到服务器
 *  2.4 获取匹配数据，覆盖到页面展示
 */
let queryParams = {
    status: '',
    channel_id: '',
    page: 1,
    per_page: 2
}
let totalPages = 0

async function renderArticleList() {
    const res = await axios({
        url: '/v1_0/mp/articles',
        params: queryParams
    })
    // console.log('res', res)
    totalPages = res.data.data.total_count
    const totalArticle = document.querySelector('.total-count')
    totalArticle.innerText = '共' + totalPages + '条'
    const articleList = res.data.data.results.map(item => `<tr>
                <td>
                  <img src="${item.cover.type === 0 ? 'https://img2.baidu.com/it/u=2640406343,1419332367&amp;fm=253&amp;fmt=auto&amp;app=138&amp;f=JPEG?w=708&amp;h=500' : item.cover.images[0]}" alt="">
                </td>
                <td>${item.title}</td>
                <td>
                 ${item.status === 1 ? `<span class="badge text-bg-primary">待审核</span>` : `<span class="badge text-bg-success">审核通过</span>`}
                </td>
                <td>
                  <span>${item.pubdate}</span>
                </td>
                <td>
                  <span>${item.read_count}</span>
                </td>
                <td>
                  <span>${item.comment_count}</span>
                </td>
                <td>
                  <span>${item.like_count}</span>
                </td>
                <td data-id="${item.id}">
                  <i class="bi bi-pencil-square edit"></i>
                  <i class="bi bi-trash3 del"></i>
                </td>
              </tr>`).join('')
    // console.log(articleList)
    document.querySelector('.art-list').innerHTML = articleList
    // console.log(res.data.data.results)
}

renderArticleList()


let formDOM = document.querySelector('.sel-form')
let formData = serialize(formDOM, {hash: true, empty: true})
formData.channel_id = ''
// console.log(formData)
formDOM.addEventListener('change', () => {
    formData = serialize(formDOM, {hash: true, empty: true})
    // console.log(formData)
})
const btn = document.querySelector('.sel-btn')
btn.addEventListener('click', async () => {
    console.log(formData)
    const res = await axios({
        url: '/v1_0/mp/articles',
        params: Object.assign(queryParams, formData)
    })
    // console.log(res)
    renderArticleList()
})
/**
 * 目标3：分页功能
 *  3.1 保存并设置文章总条数
 *  3.2 点击下一页，做临界值判断，并切换页码参数并请求最新数据
 *  3.3 点击上一页，做临界值判断，并切换页码参数并请求最新数据
 */
const lastPage = document.querySelector('.page-item.last')
const nextPage = document.querySelector('.page-item.next')
const nowPage = document.querySelector('.page-item.page-now')

nextPage.addEventListener('click', () => {
    if (queryParams.page < Math.ceil(totalPages / queryParams.page)) {
        queryParams.page++
        nowPage.innerText = `第${queryParams.page}页`
        renderArticleList()
    }
})
lastPage.addEventListener('click', () => {
    if (queryParams.page > 1) {
        queryParams.page--
        nowPage.innerText = `第${queryParams.page}页`
        renderArticleList()
    }
})

/**
 * 目标4：删除功能
 *  4.1 关联文章 id 到删除图标
 *  4.2 点击删除时，获取文章 id
 *  4.3 调用删除接口，传递文章 id 到服务器
 *  4.4 重新获取文章列表，并覆盖展示
 *  4.5 删除最后一页的最后一条，需要自动向前翻页
 */
const artList = document.querySelector('.align-middle.art-list')
artList.addEventListener('click', async (e) => {
    const parentElement = e.target.parentElement;
    if (e.target.classList.contains('del')) {
        // console.log('del')
        // console.log(parentElement)
        try {
            const res = await axios({url: `/v1_0/mp/articles/${parentElement.dataset.id}`, method: 'DELETE'})
            console.log(res)
            // renderArticleList()
            console.log(document.querySelector('.art-list').children)
            if (document.querySelector('.art-list').children.length===1&&queryParams.page!==1){
                queryParams.page--
                nowPage.innerText = `第${queryParams.page}页`
            }
            renderArticleList()

        } catch (e) {
            console.dir(e)
        }
    }
})
// 点击编辑时，获取文章 id，跳转到发布文章页面传递文章 id 过去
artList.addEventListener('click',e=>{
    if (e.target.classList.contains('edit')) {
        const id = e.target.parentElement.dataset.id
        location.href=`../publish/index.html?id=${id}`
    }
})

