import React, { useCallback, useEffect } from 'react'
import { useEditor, EditorContent, Editor as EditorInterface } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import UnderlineExtension from '@tiptap/extension-underline'
import TextAlignExtension from '@tiptap/extension-text-align'
import TextStyleExtension from '@tiptap/extension-text-style'
import { Color as ColorExtension } from '@tiptap/extension-color'
import HighlightExtension from '@tiptap/extension-highlight'
import TaskListExtension from '@tiptap/extension-task-list'
import TaskItemExtension from '@tiptap/extension-task-item'
import PlaceholderExtension from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import ImageUpload from '../image-upload'
import './editor-icon.css'
import './index.less'

const MenuBar = ({ editor }: { editor: EditorInterface | null }) => {
  const insertImage = useCallback((url: string) => {

    const image = { type: 'image', attrs: { src: url } }
    if (url && editor) {
      editor.chain().focus().insertContent([image, { type: 'paragraph', content: '' }]).run()
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className="menu-list">
      <ImageUpload
        onChange={(e)=>{
          insertImage(e)
        }}
      >
         <div className="menu-item iconfont icon-charutupian"></div>
      </ImageUpload>
      <div
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`menu-item iconfont icon-zitijiacu ${editor.isActive('bold') ? 'is-active' : ''}`}
      >
      </div>
      <div
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`menu-item iconfont icon-zitixieti ${editor.isActive('italic') ? 'is-active' : ''}`}
      >
      </div>
      <div
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`menu-item iconfont icon-zitixiahuaxian ${editor.isActive('underline') ? 'is-active' : ''}`}
      >
      </div>
      <div
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`menu-item iconfont icon-wuxupailie ${editor.isActive('bulletList') ? 'is-active' : ''}`}
      >
      </div>
      <div className="menu-item iconfont icon-undo" onClick={() => editor.chain().focus().undo().run()}>
      </div>
      <div className="menu-item iconfont icon-redo" onClick={() => editor.chain().focus().redo().run()}>
      </div>
      <div className="menu-item iconfont icon-fengexian" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
      </div>
      <div
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`menu-item iconfont icon-zitishanchuxian ${editor.isActive('strike') ? 'is-active' : ''}`}
      >
      </div>
      <div
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`menu-item iconfont icon-zuoduiqi ${editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}`}
      >
      </div>
      <div
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`menu-item iconfont icon-juzhongduiqi ${editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}`}
      >
      </div>
      <div
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`menu-item iconfont icon-youduiqi ${editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}`}
      >
      </div>
      <div
        onClick={() => {
          if (editor.isActive('textStyle', { color: '#F18101' })) {
            editor.chain().focus().setColor('#000').run()
          } else {
            editor.chain().focus().setColor('#F18101').run()
          }
        }}
        className={`menu-item iconfont icon-text_color ${editor.isActive('textStyle', { color: '#F18101' }) ? 'is-active' : ''}`}
      >
      </div>
      <div
        onClick={() => editor.chain().focus().toggleHighlight({ color: '#F18101' }).run()}
        className={`menu-item iconfont icon-fontbgcolor ${editor.isActive('highlight', { color: '#F18101' }) ? 'is-active' : ''}`}
      >
      </div>
      <div
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={`menu-item iconfont icon--checklist ${editor.isActive('taskList') ? 'is-active' : ''}`}
      >
      </div>
      <div
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`menu-item iconfont icon-youxupailie ${editor.isActive('orderedList') ? 'is-active' : ''}`}
      >
      </div>
    </div>
  )
}

interface Props {
  value: string
  maxLength?: number
  onChange: (v: {html: string, text: string})=>void
}

const Editor:React.FC<Props> = (props: Props) => {
  const { value, maxLength, onChange } = props
  const editor = useEditor({
    extensions: [
      StarterKit,
      PlaceholderExtension.configure({
        placeholder: '请尽情发挥吧......',
      }),
      ImageExtension,
      UnderlineExtension,
      TextAlignExtension.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyleExtension,
      ColorExtension,
      HighlightExtension.configure({ multicolor: true }),
      TaskListExtension,
      TaskItemExtension.configure({
        nested: true,
      }),
      CharacterCount.configure({
        limit: maxLength,
      }),
    ],
    content: value,
    onUpdate(e) {
      onChange({ html: e.editor.getHTML(), text: e.editor.getText() })
    },
  })

  useEffect(() => {
    if (value && editor) {
      editor.chain().setContent(value).run()
      onChange({ html: editor.getHTML(), text: editor.getText() })
    }
  }, [value, editor, onChange])

  return (
    <div className="editor">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <div className="character-count">
        {editor?.storage.characterCount.characters()}/{maxLength}
      </div>
    </div>
  )
}

Editor.defaultProps = {
  maxLength: 10000,
}

export default React.memo(Editor)