import React from 'react'
import {
  ArrowRight,
  BarChart3,
  Boxes,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  ClipboardList,
  FileText,
  Filter,
  GitBranch,
  Layers3,
  Lightbulb,
  Network,
  Route,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'
import {
  maturityLevels,
  moduleSummaries,
  promotionPath,
  quadrantStandards,
  scenarioItems,
} from './data/aiScenarioData'

const pages = [
  { id: 'library', label: '部门痛点与 AI 场景库', icon: Boxes },
  { id: 'quadrant', label: 'AI 价值 × 落地难度四象限', icon: BarChart3 },
  { id: 'maturity', label: '部门 AI 成熟度模型', icon: BrainCircuit },
  { id: 'path', label: '企业 AI 推广路径图', icon: Route },
]

const quadrantOrder = [
  '高价值 × 低难度',
  '高价值 × 高难度',
  '低价值 × 低难度',
  '低价值 × 高难度',
]

const quadrantTone = {
  '高价值 × 低难度': 'priority',
  '高价值 × 高难度': 'pilot',
  '低价值 × 低难度': 'template',
  '低价值 × 高难度': 'defer',
}

const statCards = [
  { label: '已梳理模块数', value: moduleSummaries.length, icon: Layers3 },
  { label: '已梳理痛点数', value: scenarioItems.length, icon: ClipboardList },
  {
    label: '高价值低难度场景数',
    value: scenarioItems.filter((item) => item.quadrant === '高价值 × 低难度').length,
    icon: TrendingUp,
  },
  {
    label: '可优先落地场景数',
    value: scenarioItems.filter((item) => item.action === '优先落地').length,
    icon: Target,
  },
]

function App() {
  const [activePage, setActivePage] = React.useState('library')
  const [activeModule, setActiveModule] = React.useState(moduleSummaries[0].module)
  const [activeQuadrant, setActiveQuadrant] = React.useState('全部')
  const [selectedScenario, setSelectedScenario] = React.useState(scenarioItems[0])
  const [selectedQuadrantScenario, setSelectedQuadrantScenario] = React.useState(scenarioItems[0])
  const [quadrantModuleFilter, setQuadrantModuleFilter] = React.useState('全部')
  const [activeMaturity, setActiveMaturity] = React.useState(maturityLevels[0].id)
  const [activePathNode, setActivePathNode] = React.useState(promotionPath[0].id)

  const page = pages.find((item) => item.id === activePage)
  const PageIcon = page.icon

  return (
    <main className="app-shell">
      <header className="hero-panel">
        <div>
          <p className="eyebrow">传统企业 AI 落地咨询成果展示 Demo</p>
          <h1>AI 落地咨询成果展示平台</h1>
          <p>
            已梳理职能部门典型业务痛点，并按照 AI 提效价值与落地难度进行初步分类。
          </p>
        </div>
        <div className="hero-proof">
          <span>4 条评估标准</span>
          <span>{scenarioItems.length} 条痛点记录</span>
          <span>{moduleSummaries.length} 个职能模块</span>
        </div>
      </header>

      <nav className="top-nav" aria-label="咨询成果模块">
        {pages.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              className={activePage === item.id ? 'active' : ''}
              onClick={() => setActivePage(item.id)}
            >
              <Icon size={18} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <section className="page-heading">
        <span>
          <PageIcon size={19} />
        </span>
        <div>
          <p className="eyebrow">当前展示模块</p>
          <h2>{page.label}</h2>
        </div>
      </section>

      {activePage === 'library' && (
        <ScenarioLibrary
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          activeQuadrant={activeQuadrant}
          setActiveQuadrant={setActiveQuadrant}
          selectedScenario={selectedScenario}
          setSelectedScenario={setSelectedScenario}
        />
      )}
      {activePage === 'quadrant' && (
        <QuadrantPage
          selectedScenario={selectedQuadrantScenario}
          setSelectedScenario={setSelectedQuadrantScenario}
          moduleFilter={quadrantModuleFilter}
          setModuleFilter={setQuadrantModuleFilter}
        />
      )}
      {activePage === 'maturity' && (
        <MaturityPage activeMaturity={activeMaturity} setActiveMaturity={setActiveMaturity} />
      )}
      {activePage === 'path' && (
        <PromotionPathPage activePathNode={activePathNode} setActivePathNode={setActivePathNode} />
      )}
    </main>
  )
}

function ScenarioLibrary({
  activeModule,
  setActiveModule,
  activeQuadrant,
  setActiveQuadrant,
  selectedScenario,
  setSelectedScenario,
}) {
  const filteredItems = scenarioItems.filter((item) => {
    const moduleMatched = item.module === activeModule
    const quadrantMatched = activeQuadrant === '全部' || item.quadrant === activeQuadrant
    return moduleMatched && quadrantMatched
  })

  React.useEffect(() => {
    if (!filteredItems.some((item) => item.id === selectedScenario?.id)) {
      setSelectedScenario(filteredItems[0] || scenarioItems.find((item) => item.module === activeModule))
    }
  }, [activeModule, activeQuadrant])

  return (
    <div className="library-page">
      <StatsStrip stats={statCards} />

      <section className="library-grid">
        <aside className="module-panel">
          <h3>职能模块</h3>
          {moduleSummaries.map((module) => (
            <button
              key={module.module}
              type="button"
              className={activeModule === module.module ? 'active' : ''}
              onClick={() => {
                setActiveModule(module.module)
                setActiveQuadrant('全部')
              }}
            >
              <span>{module.module}</span>
              <b>{module.count}</b>
            </button>
          ))}
        </aside>

        <section className="scenario-panel">
          <div className="panel-toolbar">
            <div>
              <p className="eyebrow">当前模块</p>
              <h3>{activeModule}</h3>
            </div>
            <QuadrantFilters activeQuadrant={activeQuadrant} setActiveQuadrant={setActiveQuadrant} />
          </div>

          <div className="scenario-list">
            {filteredItems.map((item) => (
              <ScenarioCard
                key={item.id}
                item={item}
                selected={selectedScenario?.id === item.id}
                onClick={() => setSelectedScenario(item)}
              />
            ))}
          </div>
        </section>

        <ScenarioDetail item={selectedScenario} />
      </section>
    </div>
  )
}

function QuadrantFilters({ activeQuadrant, setActiveQuadrant }) {
  return (
    <div className="quadrant-filters" aria-label="按四象限筛选">
      {['全部', ...quadrantOrder].map((quadrant) => (
        <button
          key={quadrant}
          type="button"
          className={activeQuadrant === quadrant ? 'active' : ''}
          onClick={() => setActiveQuadrant(quadrant)}
        >
          {quadrant === '全部' && <Filter size={14} />}
          {quadrant}
        </button>
      ))}
    </div>
  )
}

function ScenarioCard({ item, selected, onClick }) {
  return (
    <button
      type="button"
      className={`scenario-card ${selected ? 'active' : ''} ${quadrantTone[item.quadrant]}`}
      onClick={onClick}
    >
      <span>{item.module}</span>
      <strong>{item.painPoint}</strong>
      <p>{item.description}</p>
      <b>{item.quadrant}</b>
    </button>
  )
}

function ScenarioDetail({ item }) {
  if (!item) {
    return null
  }

  return (
    <aside className="detail-panel">
      <p className="eyebrow">场景详情</p>
      <h3>{item.painPoint}</h3>
      <dl>
        <div>
          <dt>所属模块</dt>
          <dd>{item.module}</dd>
        </div>
        <div>
          <dt>简要说明</dt>
          <dd>{item.description}</dd>
        </div>
        <div>
          <dt>价值/难度判断</dt>
          <dd><Badge tone={quadrantTone[item.quadrant]}>{item.quadrant}</Badge></dd>
        </div>
        <div>
          <dt>对应处理方式</dt>
          <dd><Badge tone="action">{item.action}</Badge></dd>
        </div>
      </dl>
    </aside>
  )
}

function QuadrantPage({ selectedScenario, setSelectedScenario, moduleFilter, setModuleFilter }) {
  const visibleItems = scenarioItems.filter((item) => moduleFilter === '全部' || item.module === moduleFilter)
  const grouped = Object.fromEntries(
    quadrantOrder.map((quadrant) => [
      quadrant,
      visibleItems.filter((item) => item.quadrant === quadrant),
    ]),
  )

  React.useEffect(() => {
    if (!visibleItems.some((item) => item.id === selectedScenario?.id)) {
      setSelectedScenario(visibleItems[0] || scenarioItems[0])
    }
  }, [moduleFilter])

  return (
    <div className="quadrant-page">
      <section className="quadrant-filterbar">
        <div>
          <p className="eyebrow">模块拆分</p>
          <h3>按职能模块查看四象限分布</h3>
        </div>
        <div className="module-chips">
          {['全部', ...moduleSummaries.map((item) => item.module)].map((module) => (
            <button
              key={module}
              type="button"
              className={moduleFilter === module ? 'active' : ''}
              onClick={() => setModuleFilter(module)}
            >
              {module}
              <b>
                {module === '全部'
                  ? scenarioItems.length
                  : scenarioItems.filter((item) => item.module === module).length}
              </b>
            </button>
          ))}
        </div>
      </section>

      <section className="consulting-matrix">
        {quadrantOrder.map((quadrant) => {
          const standard = quadrantStandards.find((item) => item.quadrant === quadrant)
          const moduleGroups = moduleSummaries
            .map((module) => ({
              module: module.module,
              items: grouped[quadrant].filter((item) => item.module === module.module),
            }))
            .filter((group) => group.items.length > 0)

          return (
            <article className={`quadrant-box ${quadrantTone[quadrant]}`} key={quadrant}>
              <header>
                <span>{quadrant}</span>
                <strong>{standard?.action}</strong>
                <b>{grouped[quadrant].length}</b>
              </header>
              <div className="quadrant-module-list">
                {moduleGroups.map((group) => (
                  <section className="quadrant-module-group" key={group.module}>
                    <div className="module-group-title">
                      <span>{group.module}</span>
                      <b>{group.items.length}</b>
                    </div>
                    <div className="module-scenario-grid">
                      {group.items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={selectedScenario?.id === item.id ? 'active' : ''}
                          onClick={() => setSelectedScenario(item)}
                        >
                          {item.painPoint}
                        </button>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </article>
          )
        })}
      </section>

      <section className="quadrant-side">
        <ScenarioDetail item={selectedScenario} />
        <div className="standard-panel">
          <h3>判断标准</h3>
          {quadrantStandards.map((item) => (
            <div key={item.quadrant}>
              <Badge tone={quadrantTone[item.quadrant]}>{item.quadrant}</Badge>
              <p>{item.meaning}</p>
              <strong>{item.action}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function MaturityPage({ activeMaturity, setActiveMaturity }) {
  const active = maturityLevels.find((item) => item.id === activeMaturity)

  return (
    <div className="maturity-page">
      <section className="maturity-ladder">
        {maturityLevels.map((level, index) => (
          <button
            key={level.id}
            type="button"
            className={activeMaturity === level.id ? 'active' : ''}
            onClick={() => setActiveMaturity(level.id)}
            style={{ '--step': index }}
          >
            <span>{level.level}</span>
            <strong>{level.state}</strong>
            <p>{level.capability}</p>
          </button>
        ))}
      </section>

      <section className="maturity-detail">
        <div>
          <p className="eyebrow">当前成熟度</p>
          <h3>{active.level}｜{active.state}</h3>
          <Badge tone="action">{active.capability}</Badge>
        </div>
        <div className="detail-chips">
          {active.details.map((detail) => (
            <span key={detail}>
              <CheckCircle2 size={15} />
              {detail}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}

function PromotionPathPage({ activePathNode, setActivePathNode }) {
  const active = promotionPath.find((item) => item.id === activePathNode)

  return (
    <div className="promotion-page">
      <section className="path-map">
        {promotionPath.map((node, index) => (
          <button
            key={node.id}
            type="button"
            className={activePathNode === node.id ? 'active' : ''}
            onClick={() => setActivePathNode(node.id)}
          >
            <span>{index + 1}</span>
            <strong>{node.title}</strong>
            {index < promotionPath.length - 1 && <ChevronRight size={18} />}
          </button>
        ))}
      </section>

      <section className="path-detail">
        <div>
          <p className="eyebrow">当前推进节点</p>
          <h3>{active.title}</h3>
          <p>{active.description}</p>
        </div>
        <div className="closed-loop">
          <span><SearchCheck size={18} />调研</span>
          <span><BarChart3 size={18} />评估</span>
          <span><Target size={18} />试点</span>
          <span><Network size={18} />推广</span>
          <span><GitBranch size={18} />反馈优化</span>
        </div>
      </section>
    </div>
  )
}

function StatsStrip({ stats }) {
  return (
    <section className="stats-strip">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label}>
            <Icon size={18} />
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        )
      })}
    </section>
  )
}

function Badge({ tone = 'default', children }) {
  return <span className={`badge ${tone}`}>{children}</span>
}

export default App
