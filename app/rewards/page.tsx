"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Gift, Plus, Trash2, Star, Clock } from "lucide-react"
import { rewardPool, type RewardItem, type RewardHistory } from "@/lib/reward-pool"

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<"pool" | "history" | "custom">("pool")
  const [rewardHistory, setRewardHistory] = useState<RewardHistory[]>([])
  const [customRewards, setCustomRewards] = useState<RewardItem[]>([])
  const [availableRewards, setAvailableRewards] = useState<RewardItem[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [userLevel, setUserLevel] = useState(1)

  const [newReward, setNewReward] = useState({
    title: "",
    description: "",
    category: "custom" as RewardItem["category"],
    icon: "⭐",
    rarity: "common" as RewardItem["rarity"],
    unlockLevel: 1,
  })

  useEffect(() => {
    // 加载数据
    const loadData = () => {
      const history = rewardPool.getRewardHistory()
      setRewardHistory(history)

      const custom = rewardPool.getCustomRewards()
      setCustomRewards(custom)

      // 计算用户等级
      const completedTasks = JSON.parse(localStorage.getItem("completedTasks") || "[]")
      const level = Math.floor(completedTasks.length / 5) + 1 // 每5个任务升1级
      setUserLevel(level)

      const available = rewardPool.getAvailableRewards(level)
      setAvailableRewards(available)
    }

    loadData()
  }, [])

  const handleAddCustomReward = () => {
    if (!newReward.title.trim()) return

    rewardPool.addCustomReward(newReward)
    setCustomRewards(rewardPool.getCustomRewards())
    setAvailableRewards(rewardPool.getAvailableRewards(userLevel))

    // 重置表单
    setNewReward({
      title: "",
      description: "",
      category: "custom",
      icon: "⭐",
      rarity: "common",
      unlockLevel: 1,
    })
    setShowAddForm(false)
  }

  const handleDeleteCustomReward = (rewardId: string) => {
    rewardPool.removeCustomReward(rewardId)
    setCustomRewards(rewardPool.getCustomRewards())
    setAvailableRewards(rewardPool.getAvailableRewards(userLevel))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-warm-off-white font-sans flex flex-col">
      <header className="p-4 flex items-center sticky top-0 bg-warm-off-white/80 backdrop-blur-sm z-10 border-b border-light-gray">
        <Link href="/" className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6 text-soft-gray" />
        </Link>
        <h1 className="text-lg font-semibold text-soft-gray text-center flex-grow">奖励系统</h1>
        <div className="w-6"></div>
      </header>

      {/* 标签页 */}
      <div className="p-4 pb-0">
        <div className="flex bg-white rounded-2xl p-1 shadow-soft">
          {[
            { key: "pool", label: "奖励池", icon: Gift },
            { key: "history", label: "历史", icon: Clock },
            { key: "custom", label: "自定义", icon: Star },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-medium transition-colors ${
                activeTab === key ? "bg-sage-green text-white" : "text-soft-gray hover:bg-sage-light"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-grow p-4 pt-2">
        {/* 奖励池页面 */}
        {activeTab === "pool" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-soft">
              <h3 className="font-semibold text-soft-gray mb-2">当前等级: {userLevel}</h3>
              <p className="text-sm text-soft-gray/70">
                已解锁 {availableRewards.length} 个奖励，完成更多任务解锁更多奖励！
              </p>
            </div>

            <div className="space-y-3">
              {availableRewards.map((reward) => (
                <div key={reward.id} className="bg-white rounded-2xl p-4 shadow-soft">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 ${rewardPool.getRarityBgColor(reward.rarity)} rounded-full flex items-center justify-center text-2xl`}
                    >
                      {reward.icon}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-soft-gray">{reward.title}</h4>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                            reward.rarity === "epic"
                              ? "bg-purple-100 text-purple-600"
                              : reward.rarity === "rare"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {reward.rarity === "epic" ? "史诗" : reward.rarity === "rare" ? "稀有" : "普通"}
                        </span>
                        {reward.isCustom && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-sage-light text-sage-green font-bold">
                            自定义
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-soft-gray/70">{reward.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-soft-gray/60">
                        <span>解锁等级: {reward.unlockLevel}</span>
                        <span>
                          {rewardPool.getCategoryIcon(reward.category)} {reward.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 历史记录页面 */}
        {activeTab === "history" && (
          <div className="space-y-3">
            {rewardHistory.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🎁</div>
                <p className="text-soft-gray/60">还没有获得过奖励</p>
                <p className="text-sm text-soft-gray/50 mt-1">完成任务来获得你的第一个奖励吧！</p>
              </div>
            ) : (
              rewardHistory.map((history) => {
                const reward = availableRewards.find((r) => r.id === history.rewardId)
                return (
                  <div key={history.id} className="bg-white rounded-2xl p-4 shadow-soft">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-sage-light rounded-full flex items-center justify-center text-lg">
                        {reward?.icon || "🎁"}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-soft-gray">{reward?.title || "未知奖励"}</h4>
                          <span className="text-xs text-soft-gray/60">{formatDate(history.earnedAt)}</span>
                        </div>
                        <p className="text-sm text-soft-gray/70 mb-2">任务: {history.taskTitle}</p>
                        <div className="flex items-center gap-2">
                          {history.streakMultiplier > 1 && (
                            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-bold">
                              🔥 连击 ×{history.streakMultiplier.toFixed(1)}
                            </span>
                          )}
                          {history.achievementBonus && (
                            <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full font-bold">
                              🏆 {history.achievementBonus}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* 自定义奖励页面 */}
        {activeTab === "custom" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-soft-gray">我的自定义奖励</h3>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-1 bg-sage-green text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-sage-green/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  添加
                </button>
              </div>
              <p className="text-sm text-soft-gray/70">创建属于你的个性化奖励，让完成任务变得更有意义！</p>
            </div>

            {showAddForm && (
              <div className="bg-white rounded-2xl p-4 shadow-soft">
                <h4 className="font-semibold text-soft-gray mb-3">添加自定义奖励</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-soft-gray mb-1">奖励名称</label>
                    <input
                      type="text"
                      value={newReward.title}
                      onChange={(e) => setNewReward((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="例如：看一集喜欢的剧"
                      className="w-full p-3 border border-light-gray rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-soft-gray mb-1">描述</label>
                    <textarea
                      value={newReward.description}
                      onChange={(e) => setNewReward((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="详细描述这个奖励..."
                      className="w-full p-3 border border-light-gray rounded-xl resize-none h-20 focus:outline-none focus:ring-2 focus:ring-sage-green/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-soft-gray mb-1">图标</label>
                      <input
                        type="text"
                        value={newReward.icon}
                        onChange={(e) => setNewReward((prev) => ({ ...prev, icon: e.target.value }))}
                        placeholder="🎉"
                        className="w-full p-3 border border-light-gray rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green/50 text-center"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-soft-gray mb-1">稀有度</label>
                      <select
                        value={newReward.rarity}
                        onChange={(e) => setNewReward((prev) => ({ ...prev, rarity: e.target.value as any }))}
                        className="w-full p-3 border border-light-gray rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green/50"
                      >
                        <option value="common">普通</option>
                        <option value="rare">稀有</option>
                        <option value="epic">史诗</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleAddCustomReward}
                      className="flex-1 bg-sage-green text-white py-2 rounded-xl font-medium hover:bg-sage-green/90 transition-colors"
                    >
                      添加奖励
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 border border-light-gray rounded-xl text-soft-gray hover:bg-light-gray transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {customRewards.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">⭐</div>
                  <p className="text-soft-gray/60">还没有自定义奖励</p>
                  <p className="text-sm text-soft-gray/50 mt-1">点击上方按钮创建你的专属奖励吧！</p>
                </div>
              ) : (
                customRewards.map((reward) => (
                  <div key={reward.id} className="bg-white rounded-2xl p-4 shadow-soft">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-12 h-12 ${rewardPool.getRarityBgColor(reward.rarity)} rounded-full flex items-center justify-center text-2xl`}
                      >
                        {reward.icon}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-soft-gray">{reward.title}</h4>
                          <button
                            onClick={() => handleDeleteCustomReward(reward.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-soft-gray/70 mb-2">{reward.description}</p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                              reward.rarity === "epic"
                                ? "bg-purple-100 text-purple-600"
                                : reward.rarity === "rare"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {reward.rarity === "epic" ? "史诗" : reward.rarity === "rare" ? "稀有" : "普通"}
                          </span>
                          <span className="text-xs text-soft-gray/60">
                            创建于 {reward.createdAt ? formatDate(reward.createdAt) : "未知"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
