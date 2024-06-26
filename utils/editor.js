// 富文本编辑器
// 创建编辑器函数，创建工具栏函数
const {createEditor, createToolbar} = window.wangEditor

const editorConfig = {
    placeholder: '请输入内容...',
    onChange(editor) {
        //当编辑器内容变化就把内容赋值给文本区域表单
        const html = editor.getHtml()
        document.querySelector('.publish-content').value = html
        console.log('editor content', html)
        // 也可以同步到 <textarea>
    }
}

const editor = createEditor({
    selector: '#editor-container',
    html: '<p><br></p>',
    config: editorConfig,
    mode: 'default', // or 'simple'
})

const toolbarConfig = {}

const toolbar = createToolbar({
    editor,
    selector: '#toolbar-container',
    config: toolbarConfig,
    mode: 'default', // or 'simple'
})