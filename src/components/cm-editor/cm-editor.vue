<template>
  <codemirror
    ref="myCm"
    v-model="editorValue"
    :options="cmOptions"
    @changes="onCmCodeChanges"
    @blur="onCmBlur"
    @keydown.native="onKeyDown"
    @mousedown.native="onMouseDown"
    @paste.native="OnPaste"
  >
  </codemirror>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/keymap/sublime'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/htmlmixed/htmlmixed.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/mode/yaml/yaml.js'
import 'codemirror/mode/sql/sql.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/javascript-hint.js'
import 'codemirror/addon/hint/xml-hint.js'
import 'codemirror/addon/hint/css-hint.js'
import 'codemirror/addon/hint/html-hint.js'
import 'codemirror/addon/hint/sql-hint.js'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/lint.js'
import 'codemirror/addon/lint/json-lint'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/hint/anyword-hint.js'

require('script-loader!jsonlint')
import 'codemirror/addon/lint/javascript-lint.js'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/xml-fold.js'
import 'codemirror/addon/fold/comment-fold.js'
import 'codemirror/addon/fold/markdown-fold.js'
import 'codemirror/addon/fold/indent-fold.js'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/edit/closetag.js'
import 'codemirror/addon/edit/matchtags.js'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/selection/active-line.js'
import 'codemirror/addon/search/jump-to-line.js'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/search.js'
import 'codemirror/addon/display/autorefresh.js'
import 'codemirror/addon/selection/mark-selection.js'
import 'codemirror/addon/search/match-highlighter.js'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/scroll/simplescrollbars.js'

export default {
  components: { codemirror },
  props: {
    codeValue: {
      required: true,
      type: String
    },
    cmTheme: {
      type: String
    },
    cmMode: {
      type: String
    },
    cmIndentUnit: {
      type: Number
    },
    autoFormatJson: {
      type: Boolean
    }
  },
  data() {
    return {
      cmOptions: {
        theme: !this.cmTheme || this.cmTheme === 'default' ? 'default' : this.cmTheme,  // 主题
        mode: !this.cmMode || this.cmMode === 'default' ? 'application/json' : this.cmMode,  // 代码格式
        tabSize: 4,  // tab的空格个数
        indentUnit: !this.cmIndentUnit ? 2 : this.cmIndentUnit,  // 一个块（编辑语言中的含义）应缩进多少个空格
        autocorrect: true,  // 自动更正
        spellcheck: true,  // 拼写检查
        lint: true,  // 检查格式
        lineNumbers: true,  //是否显示行数
        lineWrapping: false, //是否自动换行
        styleActiveLine: true,  //line选择是是否高亮
        keyMap: 'sublime',  // sublime编辑器效果
        matchBrackets: true,  //括号匹配
        autoCloseBrackets: true,  // 在键入时将自动关闭括号和引号
        matchTags: { bothTags: true },  // 将突出显示光标周围的标签
        foldGutter: true,  // 可将对象折叠，与下面的gutters一起使用
        scrollbarStyle: 'overlay', // simple or overlay
        gutters: [
          'CodeMirror-lint-markers',
          'CodeMirror-linenumbers',
          'CodeMirror-foldgutter'
        ],
        // highlightSelectionMatches: {
        //   minChars: 2,
        //   style: 'matchhighlight',
        //   showToken: true
        // },
        extraKeys: {
          Tab: (cm) => {
            if (cm.somethingSelected()) {      // 存在文本选择
              cm.indentSelection('add')    // 正向缩进文本
            } else {                    // 无文本选择
              cm.replaceSelection(Array(cm.getOption('indentUnit') + 1).join(' '), 'end', '+input')  // 光标处插入 indentUnit 个空格
            }
          }
        }
      },
      enableAutoFormatJson: this.autoFormatJson == null ? true : this.autoFormatJson  // json编辑模式下，输入框失去焦点时是否自动格式化，true 开启， false 关闭
    }
  },
  created() {
    this.editorValue = this.codeValue
    try {
      if (!this.editorValue) {
        this.cmOptions.lint = false
        return
      }
      if (this.cmOptions.mode === 'application/json') {
        if (!this.enableAutoFormatJson) {
          return
        }
        this.editorValue = this.formatStrInJson(this.editorValue)
      }
    } catch (e) {
      console.log('初始化codemirror出错：' + e)
    }
  },
  computed: {
    editorValue: {
      get() {
        return this.codeValue
      },
      set(val) {
        this.$emit('update:codeValue', val)
      }
    }
  },
  methods: {
    resetLint() {
      if (!this.$refs.myCm.codemirror.getValue()) {
        this.$nextTick(() => {
          this.$refs.myCm.codemirror.setOption('lint', false)
        })
        return
      }
      this.$refs.myCm.codemirror.setOption('lint', false)
      this.$nextTick(() => {
        this.$refs.myCm.codemirror.setOption('lint', true)
      })
    },
    // 格式化字符串为json格式字符串
    formatStrInJson(strValue) {
      return JSON.stringify(
        JSON.parse(strValue),
        null,
        this.cmIndentUnit
      )
    },
    onCmCodeChanges(cm, changes) {
      this.editorValue = cm.getValue()
      this.resetLint()
    },
    // 失去焦点时处理函数
    onCmBlur(cm, event) {
      try {
        let editorValue = cm.getValue()
        if (this.cmOptions.mode === 'application/json' && editorValue) {
          if (!this.enableAutoFormatJson) {
            return
          }
          this.editorValue = this.formatStrInJson(editorValue)
        }
      } catch (e) {
        // 啥也不做
      }
    },
    // 按下键盘事件处理函数
    onKeyDown(event) {
      const keyCode = event.keyCode || event.which || event.charCode
      const keyCombination =
        event.ctrlKey || event.altKey || event.metaKey
      if (!keyCombination && keyCode > 64 && keyCode < 123) {
        this.$refs.myCm.codemirror.showHint({
          completeSingle: false,
          container: document.getElementById('el-node-form')
        })
      }
    },
    // 按下鼠标时事件处理函数
    onMouseDown(event) {
      this.$refs.myCm.codemirror.closeHint()
    },
    // 黏贴事件处理函数
    OnPaste(event) {
      if (this.cmOptions.mode === 'application/json') {
        try {
          this.editorValue = this.formatStrInJson(this.editorValue)
        } catch (e) {
          // 啥都不做
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
