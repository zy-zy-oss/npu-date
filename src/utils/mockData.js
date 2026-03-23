// Mock数据配置
export const MOCK_DELAY = 300 // 模拟网络延迟(ms)

// 开发环境预定义验证码
export const MOCK_VERIFICATION_CODE = '123456'

// 用户数据
export const mockUsers = [
  {
    id: 1,
    email: 'test@nwpu.edu.cn',
    password: '123456',
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
        { label: '女', value: 'female' },
        { label: '不限', value: 'any' }
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
      type: 'range',
      title: '年龄范围',
      key: 'ageRange',
      required: true,
      min: 18,
      max: 45,
      step: 1,
      minGap: 1,
      unit: '岁'
    },
    {
      id: 4,
      type: 'radio',
      title: '身份',
      key: 'identity',
      required: true,
      options: [
        { label: '在读本科', value: 'undergraduate' },
        { label: '在读硕士', value: 'master' },
        { label: '在读博士', value: 'doctor' },
        { label: '教职工', value: 'staff' },
        { label: '校友', value: 'alumni' },
        { label: '保密', value: 'secret' }
      ]
    },
    {
      id: 5,
      type: 'region',
      title: '现居地',
      key: 'currentLocation',
      required: true,
      showPreview: true
    },
    {
      id: 6,
      type: 'radio',
      title: '所在校区',
      key: 'location',
      required: true,
      options: [
        { label: '友谊校区', value: '友谊校区' },
        { label: '长安校区', value: '长安校区' },
        { label: '不限', value: 'any' }
      ]
    },
    {
      id: 7,
      type: 'textarea',
      title: '自我介绍',
      key: 'bio',
      required: true,
      placeholder: '请介绍一下自己，让TA更好地了解你~',
      maxLength: 200
    },
    {
      id: 8,
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
      min: 120,
      max: 220,
      step: 1,
      minGap: 5,
      unit: 'cm',
      defaultMin: 155,
      defaultMax: 185
    },
    {
      id: 2,
      type: 'range',
      title: '期望对方年龄范围',
      key: 'ageRange',
      required: false,
      min: 18,
      max: 35,
      step: 1,
      minGap: 1,
      unit: '岁',
      defaultMin: 19,
      defaultMax: 29
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
      type: 'radio',
      title: '搭子类型',
      key: 'buddyCategory',
      required: true,
      options: [
        { label: '学习成长类', value: 'study' },
        { label: '运动健康类', value: 'sports' },
        { label: '游戏娱乐类', value: 'game' },
        { label: '生活娱乐类', value: 'life' }
      ]
    },
    {
      id: 2,
      type: 'radio',
      title: '具体学习成长类型',
      key: 'studyType',
      required: true,
      dependencies: {
        buddyCategory: ['study']
      },
      options: [
        { label: '学习', value: 'study_basic' },
        { label: '考研', value: 'study_kaoyan' },
        { label: '考公', value: 'study_kaogong' },
        { label: '阅读', value: 'study_reading' },
        { label: '竞赛', value: 'study_competition' },
        { label: '口语', value: 'study_oral' }
      ]
    },
    {
      id: 3,
      type: 'radio',
      title: '具体运动健康类型',
      key: 'sportsType',
      required: true,
      dependencies: {
        buddyCategory: ['sports']
      },
      options: [
        { label: '跑步', value: 'sports_running' },
        { label: '爬山', value: 'sports_hiking' },
        { label: '游泳', value: 'sports_swimming' },
        { label: '羽毛球', value: 'sports_badminton' },
        { label: '篮球', value: 'sports_basketball' },
        { label: '乒乓球', value: 'sports_tennis' },
        { label: '台球', value: 'sports_billiards' },
        { label: '骑行', value: 'sports_cycling' }
      ]
    },
    {
      id: 4,
      type: 'radio',
      title: '具体游戏类型',
      key: 'gameType',
      required: true,
      dependencies: {
        buddyCategory: ['game']
      },
      options: [
        { label: 'FPS', value: 'game_fps' },
        { label: 'Moba', value: 'game_moba' },
        { label: '开放世界/二次元', value: 'game_openworld' },
        { label: '派对/休闲', value: 'game_party' },
        { label: '生存沙盒建设', value: 'game_survival' },
        { label: '杀戮尖塔', value: 'game_slaythespire' }
      ]
    },
    {
      id: 5,
      type: 'radio',
      title: '具体生活类型',
      key: 'lifeType',
      required: true,
      dependencies: {
        buddyCategory: ['life']
      },
      options: [
        { label: '即时活动搭子（演唱会、音乐节、话剧、漫展、艺术展）', value: 'life_immediate' },
        { label: '自律', value: 'life_selfdiscipline' },
        { label: '摄影', value: 'life_photography' },
        { label: '剧本杀', value: 'life_boardgame' },
        { label: 'K歌', value: 'life_karaoke' },
        { label: '饭搭子', value: 'life_food' },
        { label: 'City Walk搭子', value: 'life_citywalk' },
        { label: '观影搭子', value: 'life_movie' },
        { label: '观鸟', value: 'life_birdwatching' },
        { label: '钓鱼搭子', value: 'life_fishing' }
      ]
    },
    {
      id: 6,
      type: 'radio',
      title: '选择活动类型',
      key: 'activityType',
      required: true,
      dependencies: {
        lifeType: ['life_immediate']
      },
      options: [
        { label: '演唱会', value: 'concert' },
        { label: '音乐节', value: 'music_festival' },
        { label: '话剧', value: 'drama' },
        { label: '艺术展', value: 'exhibition' },
        { label: '漫展', value: 'comic_con' }
      ]
    },
    {
      id: 7,
      type: 'region',
      title: '选择活动城市',
      key: 'activityCity',
      required: true,
      dependencies: {
        lifeType: ['life_immediate']
      },
      showPreview: true
    },
    {
      id: 8,
      type: 'input',
      title: '填写活动名称',
      key: 'activityName',
      required: true,
      placeholder: '例如：周杰伦 2026 巡回演唱会',
      dependencies: {
        lifeType: ['life_immediate']
      }
    },
    {
      id: 9,
      type: 'date',
      title: '选择活动时间',
      key: 'activityTime',
      required: true,
      dependencies: {
        lifeType: ['life_immediate']
      }
    },
    {
      id: 10,
      type: 'radio',
      title: '匹配灵活度',
      key: 'matchFlexibility',
      required: true,
      dependencies: {
        lifeType: ['life_immediate']
      },
      options: [
        { label: '只接受同一活动', value: 'same_activity' },
        { label: '接受同城市不同活动', value: 'same_city' }
      ]
    },
    {
      id: 11,
      type: 'textarea',
      title: '备注',
      key: 'activityRemark',
      required: false,
      placeholder: '可备注场次等信息',
      maxLength: 100,
      dependencies: {
        lifeType: ['life_immediate']
      }
    },
    {
      id: 12,
      type: 'date',
      title: '时效（到何时停止匹配）',
      key: 'timeLimit',
      required: true,
      placeholder: '请选择截止时间'
    },
    {
      id: 13,
      type: 'radio',
      title: '结伴方式',
      key: 'buddyMode',
      required: true,
      options: [
        { label: '1V1', value: 'one_on_one' },
        { label: 'NVN', value: 'group' }
      ]
    },
    {
      id: 14,
      type: 'select',
      title: 'NVN人数',
      key: 'groupSize',
      required: true,
      dependencies: {
        buddyMode: ['group']
      },
      options: [
        { label: '3人', value: '3' },
        { label: '4人', value: '4' },
        { label: '5人', value: '5' },
        { label: '6人', value: '6' },
        { label: '7人及以上', value: '7+' }
      ]
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