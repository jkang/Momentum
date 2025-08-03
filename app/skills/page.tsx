"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Star, Lock, Trophy } from "lucide-react"
import { skillTree, type SkillCategory } from "@/lib/skill-tree"
import { SkillTreeNode } from "@/components/skill-tree-node"

export default function SkillsPage() {
  const [categories, setCategories] = useState<SkillCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [skillStats, setSkillStats] = useState({
    totalSkills: 0,
    unlockedSkills: 0,
    skillsByCategory: {} as Record<string, { total: number; unlocked: number }>,
  })

  useEffect(() => {
    // 加载技能树数据
    const loadData = () => {
      const cats = skillTree.getAllCategories()
      setCategories(cats)

      const stats = skillTree.getSkillStats()
      setSkillStats(stats)

      // 更新所有技能的解锁进度
      skillTree.updateAllSkillProgress()

      // 默认选择第一个分类
      if (cats.length > 0 && !selectedCategory) {
        setSelectedCategory(cats[0].id)
      }
    }

    loadData()
  }, [selectedCategory])

  const handleSkillUnlock = (skillId: string) => {
    // 重新加载数据以反映变化
    const cats = skillTree.getAllCategories()
    setCategories(cats)

    const stats = skillTree.getSkillStats()
    setSkillStats(stats)
  }

  const selectedCat = categories.find((c) => c.id === selectedCategory)

  return (
    <div className="max-w-md mx-auto min-h-screen bg-warm-off-white font-sans flex flex-col">
      <header className="p-4 flex items-center sticky top-0 bg-warm-off-white/80 backdrop-blur-sm z-10 border-b border-light-gray">
        <Link href="/" className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6 text-soft-gray" />
        </Link>
        <h1 className="text-lg font-semibold text-soft-gray text-center flex-grow">技能树</h1>
        <div className="w-6"></div>
      </header>

      <main className="flex-grow p-4">
        {/* 技能统计概览 */}
        <div className="bg-white rounded-2xl p-4 shadow-soft mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-soft-gray">技能掌握度</h2>
              <p className="text-sm text-soft-gray/60">解锁技能来提升你的能力</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-sage-green">
                {skillStats.unlockedSkills}/{skillStats.totalSkills}
              </div>
              <div className="text-xs text-soft-gray/60">已解锁技能</div>
            </div>
          </div>

          <div className="w-full bg-light-gray rounded-full h-3 mb-4">
            <div
              className="bg-sage-green h-3 rounded-full transition-all duration-500"
              style={{ width: `${(skillStats.unlockedSkills / skillStats.totalSkills) * 100}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Star className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
              <div className="text-sm font-semibold text-soft-gray">{skillStats.unlockedSkills}</div>
              <div className="text-xs text-soft-gray/60">已解锁</div>
            </div>
            <div>
              <Lock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <div className="text-sm font-semibold text-soft-gray">
                {skillStats.totalSkills - skillStats.unlockedSkills}
              </div>
              <div className="text-xs text-soft-gray/60">待解锁</div>
            </div>
            <div>
              <Trophy className="w-5 h-5 text-sunrise-coral mx-auto mb-1" />
              <div className="text-sm font-semibold text-soft-gray">{categories.length}</div>
              <div className="text-xs text-soft-gray/60">技能分类</div>
            </div>
          </div>
        </div>

        {/* 技能分类选择 */}
        <div className="mb-6">
          <h3 className="font-semibold text-soft-gray mb-3">技能分类</h3>
          <div className="space-y-3">
            {categories.map((category) => {
              const categoryStats = skillStats.skillsByCategory[category.id] || { total: 0, unlocked: 0 }
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                    selectedCategory === category.id
                      ? "border-sage-green bg-sage-light"
                      : "border-light-gray bg-white hover:border-sage-green/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ backgroundColor: category.color + "20", color: category.color }}
                      >
                        {category.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-soft-gray">{category.name}</h4>
                        <p className="text-sm text-soft-gray/60">{category.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-sage-green">
                        {categoryStats.unlocked}/{categoryStats.total}
                      </div>
                      <div className="text-xs text-soft-gray/60">已解锁</div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="w-full bg-light-gray rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${categoryStats.total > 0 ? (categoryStats.unlocked / categoryStats.total) * 100 : 0}%`,
                          backgroundColor: category.color,
                        }}
                      ></div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* 技能树可视化 */}
        {selectedCat && (
          <div className="bg-white rounded-2xl p-4 shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{ backgroundColor: selectedCat.color + "20", color: selectedCat.color }}
              >
                {selectedCat.icon}
              </div>
              <div>
                <h3 className="font-bold text-soft-gray">{selectedCat.name}</h3>
                <p className="text-sm text-soft-gray/60">{selectedCat.description}</p>
              </div>
            </div>

            {/* 技能树画布 */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 min-h-96 overflow-hidden">
              {/* 连接线 */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                {selectedCat.nodes.map((skill) =>
                  skill.prerequisites.map((prereqId) => {
                    const prereq = selectedCat.nodes.find((s) => s.id === prereqId)
                    if (!prereq) return null

                    return (
                      <line
                        key={`${prereqId}-${skill.id}`}
                        x1={prereq.position.x + 64} // 节点中心
                        y1={prereq.position.y + 64}
                        x2={skill.position.x + 64}
                        y2={skill.position.y + 64}
                        stroke={skill.isUnlocked ? selectedCat.color : "#D1D5DB"}
                        strokeWidth="2"
                        strokeDasharray={skill.isUnlocked ? "0" : "5,5"}
                      />
                    )
                  }),
                )}
              </svg>

              {/* 技能节点 */}
              <div className="relative" style={{ zIndex: 2 }}>
                {selectedCat.nodes.map((skill) => (
                  <SkillTreeNode key={skill.id} skill={skill} onUnlock={handleSkillUnlock} />
                ))}
              </div>

              {/* 图例 */}
              <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3 text-xs">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-sage-green rounded-full"></div>
                    <span>已解锁</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-sunrise-coral rounded-full"></div>
                    <span>可解锁</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    <span>未满足条件</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 技能列表视图 */}
            <div className="mt-6">
              <h4 className="font-semibold text-soft-gray mb-3">技能列表</h4>
              <div className="space-y-2">
                {selectedCat.nodes
                  .sort((a, b) => a.tier - b.tier || (b.isUnlocked ? 1 : 0) - (a.isUnlocked ? 1 : 0))
                  .map((skill) => {
                    const { canUnlock, progress } = skillTree.checkSkillUnlockConditions(skill.id)
                    return (
                      <div
                        key={skill.id}
                        className={`p-3 rounded-xl border transition-all ${
                          skill.isUnlocked
                            ? "border-sage-green bg-sage-light"
                            : canUnlock
                              ? "border-sunrise-coral bg-sunrise-coral/10"
                              : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                              skill.isUnlocked
                                ? "bg-sage-green text-white"
                                : canUnlock
                                  ? "bg-sunrise-coral text-white"
                                  : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {skill.isUnlocked ? "✓" : canUnlock ? skill.icon : <Lock className="w-4 h-4" />}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium text-soft-gray">{skill.name}</h5>
                              <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">
                                T{skill.tier}
                              </span>
                            </div>
                            <p className="text-sm text-soft-gray/70">{skill.description}</p>
                            {!skill.isUnlocked && progress > 0 && (
                              <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-1">
                                  <div
                                    className="bg-sunrise-coral h-1 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                  ></div>
                                </div>
                                <div className="text-xs text-soft-gray/60 mt-1">{progress.toFixed(0)}% 解锁进度</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
