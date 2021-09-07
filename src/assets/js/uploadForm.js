import dayjs from 'dayjs'

// 标题最大值
const titleMaxLen = 60

// 默认文章标题
export const title = `note_${dayjs().format('YYYYMMDD')}`

export const formOptions = {
  label: [
    {
      model: 'title',
      label: '文章标题',
      max: titleMaxLen,
      placeholder: title,
      clearable: true,
      showWordLimit: true
    },
    {
      model: 'category',
      label: '分类专栏',
      type: 'select',
      width: '100%',
      placeholder: '选择分类',
      clearable: true,
      filterable: true,
      allowCreate: true,
      valueObject: true,
      defaultFirstOption: true,
      tooltipContent: '支持输入搜索或新建分类~',
      tooltipPlacement: 'top',
      options: []
    },
    {
      model: 'date',
      label: '创作日期',
      type: 'date',
      width: '100%',
      placeholder: '选择日期'
    },
    {
      model: 'tags',
      label: '文章标签',
      type: 'tagCheck',
      max: 5,
      options: []
    },
    {
      model: 'type',
      label: '文章类型',
      type: 'select',
      width: '100%',
      placeholder: '选择类型',
      options: [
        {
          label: '原创',
          value: 0
        },
        {
          label: '转载',
          value: 1
        },
        {
          label: '翻译',
          value: 2
        }
      ]
    }
  ],
  rules: {
    title: [
      { max: titleMaxLen, message: `长度不能超过 ${titleMaxLen} 个字符`, trigger: 'change' }
    ],
    category: [
      { required: true, message: '请选择文章分类', trigger: 'change' }
    ],
    date: [
      { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
    ],
    type: [
      { required: true, message: '请选择文章类型', trigger: 'change' }
    ]
  }
}
