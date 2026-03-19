// Mock数据配置
export const MOCK_DELAY = 300 // 模拟网络延迟(ms)

// 用户数据
export const mockUsers = [
  {
    id: 1,
    email: 'test@nwpu.edu.cn',
    name: '张三',
    gender: 'male',
    grade: '2022',
    major: '计算机科学与技术',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhangSan',
    bio: '热爱编程，喜欢打篮球',
    location: '长安校区',
    hobbies: ['篮球', '编程', '音乐'],
    personality: '开朗外向',
    height: 178,
    zodiac: '天秤座',
    status: 'active',
    role: 'user',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    email: 'user1@nwpu.edu.cn',
    name: '李四',
    gender: 'female',
    grade: '2021',
    major: '电子信息工程',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiSi',
    bio: '喜欢拍照，旅行',
    location: '友谊校区',
    hobbies: ['摄影', '旅行', '美食'],
    personality: '温柔细腻',
    height: 165,
    zodiac: '双子座',
    status: 'active',
    role: 'user',
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    id: 3,
    email: 'user2@nwpu.edu.cn',
    name: '王五',
    gender: 'male',
    grade: '2023',
    major: '机械工程',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WangWu',
    bio: '健身达人',
    location: '长安校区',
    hobbies: ['健身', '游戏', '电影'],
    personality: '成熟稳重',
    height: 180,
    zodiac: '射手座',
    status: 'active',
    role: 'user',
    createdAt: '2024-02-01T10:00:00Z'
  },
  {
    id: 4,
    email: 'user3@nwpu.edu.cn',
    name: '赵六',
    gender: 'female',
    grade: '2022',
    major: '软件工程',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhaoLiu',
    bio: '热爱学习，安静的女生',
    location: '长安校区',
    hobbies: ['阅读', '绘画', '瑜伽'],
    personality: '文静内敛',
    height: 162,
    zodiac: '处女座',
    status: 'active',
    role: 'user',
    createdAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 5,
    email: 'admin@nwpu.edu.cn',
    name: '管理员',
    gender: 'male',
    grade: '2020',
    major: '信息管理与信息系统',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    bio: '平台管理员',
    location: '友谊校区',
    hobbies: ['管理', '技术'],
    personality: '稳重',
    height: 175,
    zodiac: '狮子座',
    status: 'active',
    role: 'admin',
    createdAt: '2024-01-01T10:00:00Z'
  }
]

// 问卷题目 - 基础问卷
export const mockQuestionnaire = {
  questions: [
    {
      id: 1,
      type: 'radio',
      title: '你的性别',
      key: 'gender',
      required: true,
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' }
      ]
    },
    {
      id: 2,
      type: 'radio',
      title: '期望对象的性别',
      key: 'preferGender',
      required: true,
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
        { label: '不限', value: 'any' }
      ]
    },
    {
      id: 3,
      type: 'datetime',
      title: '出生日期时间',
      key: 'birthday',
      required: true,
      startYear: 1995,
      endYear: 2006,
      showPreview: true
    },
    {
      id: 4,
      type: 'radio',
      title: '年级',
      key: 'grade',
      required: true,
      options: [
        { label: '2020级', value: '2020' },
        { label: '2021级', value: '2021' },
        { label: '2022级', value: '2022' },
        { label: '2023级', value: '2023' },
        { label: '2024级', value: '2024' }
      ]
    },
    {
      id: 5,
      type: 'radio',
      title: '专业',
      key: 'major',
      required: true,
      options: [
        { label: '计算机科学与技术', value: '计算机科学与技术' },
        { label: '软件工程', value: '软件工程' },
        { label: '电子信息工程', value: '电子信息工程' },
        { label: '机械工程', value: '机械工程' },
        { label: '自动化', value: '自动化' },
        { label: '材料科学与工程', value: '材料科学与工程' },
        { label: '飞行器设计与工程', value: '飞行器设计与工程' },
        { label: '信息管理与信息系统', value: '信息管理与信息系统' },
        { label: '工商管理', value: '工商管理' },
        { label: '其他', value: '其他' }
      ]
    },
    {
      id: 6,
      type: 'region',
      title: '家乡所在地',
      key: 'hometown',
      required: true,
      showPreview: true
    },
    {
      id: 7,
      type: 'radio',
      title: '所在校区',
      key: 'location',
      required: true,
      options: [
        { label: '友谊校区', value: '友谊校区' },
        { label: '长安校区', value: '长安校区' },
        { label: '其他', value: '其他' }
      ]
    },
    {
      id: 8,
      type: 'slider',
      title: '身高(cm)',
      key: 'height',
      required: false,
      min: 150,
      max: 200,
      step: 1,
      defaultValue: 170
    },
    {
      id: 9,
      type: 'checkbox',
      title: '兴趣爱好',
      key: 'hobbies',
      required: false,
      options: [
        { label: '篮球', value: '篮球' },
        { label: '足球', value: '足球' },
        { label: '羽毛球', value: '羽毛球' },
        { label: '跑步', value: '跑步' },
        { label: '健身', value: '健身' },
        { label: '游泳', value: '游泳' },
        { label: '摄影', value: '摄影' },
        { label: '旅行', value: '旅行' },
        { label: '音乐', value: '音乐' },
        { label: '电影', value: '电影' },
        { label: '读书', value: '读书' },
        { label: '绘画', value: '绘画' },
        { label: '游戏', value: '游戏' },
        { label: '美食', value: '美食' },
        { label: '编程', value: '编程' },
        { label: '其他', value: '其他' }
      ]
    },
    {
      id: 10,
      type: 'radio',
      title: '性格类型',
      key: 'personality',
      required: false,
      options: [
        { label: '开朗外向', value: '开朗外向' },
        { label: '成熟稳重', value: '成熟稳重' },
        { label: '文静内敛', value: '文静内敛' },
        { label: '幽默风趣', value: '幽默风趣' },
        { label: '温柔细腻', value: '温柔细腻' }
      ]
    },
    {
      id: 11,
      type: 'textarea',
      title: '自我介绍',
      key: 'bio',
      required: true,
      placeholder: '请介绍一下自己，让TA更好地了解你~',
      maxLength: 200
    },
    {
      id: 12,
      type: 'radio',
      title: '你希望在这里寻找？',
      key: 'lookingFor',
      required: true,
      options: [
        { label: '对象', value: 'date' },
        { label: '搭子', value: 'buddy' }
      ]
    }
  ]
}

// 问卷题目 - 约会问卷
export const mockQuestionnaire_1 = {
  type: 'date',
  questions: [
    {
      id: 1,
      type: 'range',
      title: '期望对方身高范围(cm)',
      key: 'heightRange',
      required: false,
      min: 150,
      max: 200,
      step: 1,
      minGap: 5,
      unit: 'cm',
      defaultMin: 160,
      defaultMax: 180
    },
    {
      id: 2,
      type: 'range',
      title: '期望对方年龄范围',
      key: 'ageRange',
      required: false,
      min: 18,
      max: 30,
      step: 1,
      minGap: 1,
      unit: '岁',
      defaultMin: 20,
      defaultMax: 25
    },
    {
      id: 3,
      type: 'checkbox',
      title: '期望对方年级',
      key: 'preferGrade',
      required: false,
      options: [
        { label: '2020级', value: '2020' },
        { label: '2021级', value: '2021' },
        { label: '2022级', value: '2022' },
        { label: '2023级', value: '2023' },
        { label: '2024级', value: '2024' }
      ]
    },
    {
      id: 4,
      type: 'checkbox',
      title: '期望对方专业',
      key: 'preferMajor',
      required: false,
      options: [
        { label: '计算机科学与技术', value: '计算机科学与技术' },
        { label: '软件工程', value: '软件工程' },
        { label: '电子信息工程', value: '电子信息工程' },
        { label: '机械工程', value: '机械工程' },
        { label: '自动化', value: '自动化' },
        { label: '材料科学与工程', value: '材料科学与工程' },
        { label: '飞行器设计与工程', value: '飞行器设计与工程' },
        { label: '信息管理与信息系统', value: '信息管理与信息系统' },
        { label: '工商管理', value: '工商管理' },
        { label: '不限', value: '不限' }
      ]
    },
    {
      id: 5,
      type: 'radio',
      title: '是否颜控',
      key: 'appearanceFirst',
      required: false,
      options: [
        { label: '是', value: true },
        { label: '否，更看重内在', value: false }
      ]
    },
    {
      id: 6,
      type: 'checkbox',
      title: '你在意对方的条件',
      key: 'preferences',
      required: false,
      options: [
        { label: '身高', value: 'height' },
        { label: '学历', value: 'education' },
        { label: '专业', value: 'major' },
        { label: '兴趣爱好', value: 'hobbies' },
        { label: '性格', value: 'personality' },
        { label: '家乡', value: 'hometown' },
        { label: '只要有缘', value: 'fate' }
      ]
    },
    {
      id: 7,
      type: 'checkbox',
      title: '期望对方性格',
      key: 'preferPersonality',
      required: false,
      options: [
        { label: '开朗外向', value: '开朗外向' },
        { label: '成熟稳重', value: '成熟稳重' },
        { label: '文静内敛', value: '文静内敛' },
        { label: '幽默风趣', value: '幽默风趣' },
        { label: '温柔细腻', value: '温柔细腻' }
      ]
    },
    {
      id: 8,
      type: 'radio',
      title: '恋爱经历',
      key: 'loveHistory',
      required: false,
      options: [
        { label: '从未恋爱过', value: 'none' },
        { label: '恋爱过1-2次', value: 'few' },
        { label: '恋爱过3次以上', value: 'many' }
      ]
    },
    {
      id: 9,
      type: 'radio',
      title: '恋爱观',
      key: 'loveView',
      required: false,
      options: [
        { label: '奔着结婚去', value: 'marriage' },
        { label: '认真谈一场', value: 'serious' },
        { label: '顺其自然', value: 'natural' }
      ]
    },
    {
      id: 10,
      type: 'textarea',
      title: '理想对象描述',
      key: 'idealDesc',
      required: false,
      placeholder: '描述一下你理想中的TA~',
      maxLength: 200
    }
  ]
}

// 问卷题目 - 搭子问卷
export const mockQuestionnaire_2 = {
  type: 'buddy',
  questions: [
    {
      id: 1,
      type: 'checkbox',
      title: '寻找什么类型的搭子',
      key: 'buddyType',
      required: true,
      options: [
        { label: '学习搭子', value: 'study' },
        { label: '运动搭子', value: 'sports' },
        { label: '饭搭子', value: 'food' },
        { label: '游戏搭子', value: 'game' },
        { label: '旅行搭子', value: 'travel' },
        { label: '购物搭子', value: 'shopping' },
        { label: '观影搭子', value: 'movie' },
        { label: '其他', value: 'other' }
      ]
    },
    {
      id: 2,
      type: 'radio',
      title: '期望搭子性别',
      key: 'buddyGender',
      required: false,
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
        { label: '不限', value: 'any' }
      ]
    },
    {
      id: 3,
      type: 'checkbox',
      title: '期望搭子年级',
      key: 'buddyGrade',
      required: false,
      options: [
        { label: '2020级', value: '2020' },
        { label: '2021级', value: '2021' },
        { label: '2022级', value: '2022' },
        { label: '2023级', value: '2023' },
        { label: '2024级', value: '2024' }
      ]
    },
    {
      id: 4,
      type: 'checkbox',
      title: '共同活动时间',
      key: 'availableTime',
      required: false,
      options: [
        { label: '工作日白天', value: 'weekday_day' },
        { label: '工作日晚上', value: 'weekday_night' },
        { label: '周末白天', value: 'weekend_day' },
        { label: '周末晚上', value: 'weekend_night' },
        { label: '时间灵活', value: 'flexible' }
      ]
    },
    {
      id: 5,
      type: 'radio',
      title: '活动频率期望',
      key: 'frequency',
      required: false,
      options: [
        { label: '每周1-2次', value: 'low' },
        { label: '每周3-4次', value: 'medium' },
        { label: '每天', value: 'high' },
        { label: '随缘', value: 'random' }
      ]
    },
    {
      id: 6,
      type: 'checkbox',
      title: '期望搭子性格',
      key: 'buddyPersonality',
      required: false,
      options: [
        { label: '开朗外向', value: '开朗外向' },
        { label: '成熟稳重', value: '成熟稳重' },
        { label: '文静内敛', value: '文静内敛' },
        { label: '幽默风趣', value: '幽默风趣' },
        { label: '温柔细腻', value: '温柔细腻' }
      ]
    },
    {
      id: 7,
      type: 'textarea',
      title: '对搭子的期望',
      key: 'buddyExpectation',
      required: false,
      placeholder: '描述一下你期望的搭子是什么样的~',
      maxLength: 200
    }
  ]
}

// 公告数据
export const mockNotices = [
  {
    id: 1,
    title: '欢迎使用NPU Date',
    content: '西北工业大学专属校园交友匹配平台，一周一会双向选择，实名制校园交友。',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    status: 'active'
  },
  {
    id: 2,
    title: '关于本周匹配',
    content: '本周五将进行匹配，请大家尽快填写问卷~',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    status: 'active'
  }
]

// 操作日志
export const mockLogs = [
  {
    id: 1,
    action: '用户注册',
    operator: 'test@nwpu.edu.cn',
    target: 'test@nwpu.edu.cn',
    detail: '新用户注册',
    createdAt: '2024-03-18T10:00:00Z'
  },
  {
    id: 2,
    action: '填写问卷',
    operator: 'test@nwpu.edu.cn',
    target: 'test@nwpu.edu.cn',
    detail: '完成匹配问卷',
    createdAt: '2024-03-18T11:00:00Z'
  },
  {
    id: 3,
    action: '匹配结果',
    operator: '系统',
    target: 'test@nwpu.edu.cn',
    detail: '匹配成功',
    createdAt: '2024-03-18T12:00:00Z'
  }
]

// 匹配结果
export const mockMatchResult = {
  matched: true,
  matchedUser: {
    id: 2,
    email: 'user1@nwpu.edu.cn',
    name: '李四',
    gender: 'female',
    grade: '2021',
    major: '电子信息工程',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiSi',
    bio: '喜欢拍照，旅行',
    location: '友谊校区',
    hobbies: ['摄影', '旅行', '美食'],
    personality: '温柔细腻',
    height: 165,
    zodiac: '双子座'
  },
  matchScore: 85,
  matchTime: '2024-03-18T12:00:00Z',
  email: 'user1@nwpu.edu.cn',
  phone: '138****1234'
}