"use client"

import {
  ArrowLeft,
  Camera,
  Lock,
  Bell,
  Palette,
  Languages,
  Shield,
  FileCodeIcon as FileContract,
  Trash,
} from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 shadow-soft-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="ml-3 text-xl font-bold text-gray-800">个人设置</h1>
          </div>
          <div className="flex items-center">
            <button className="px-4 py-2 bg-coral-400 text-white rounded-full text-sm font-medium">保存</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        {/* Profile Section */}
        <section className="mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-soft-sm">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full bg-sage-400 flex items-center justify-center text-white text-xl font-bold">
                思
              </div>
              <div className="ml-5">
                <h2 className="text-xl font-bold text-gray-800">李思慧</h2>
                <p className="text-gray-600">sophie.li@example.com</p>
                <button className="mt-2 text-coral-500 text-sm font-medium flex items-center">
                  <Camera className="w-4 h-4 mr-1" /> 更换头像
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Personal Info Section */}
        <section className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 px-1">个人信息</h3>
          <div className="bg-white rounded-2xl p-5 shadow-soft-sm">
            <div className="mb-4">
              <label className="block text-gray-600 text-sm mb-2" htmlFor="name">
                姓名
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:border-coral-400"
                defaultValue="李思慧"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm mb-2" htmlFor="nickname">
                昵称
              </label>
              <input
                id="nickname"
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:border-coral-400"
                defaultValue="思慧"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm mb-2" htmlFor="email">
                邮箱
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:border-coral-400"
                defaultValue="sophie.li@example.com"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-2" htmlFor="phone">
                手机号码
              </label>
              <input
                id="phone"
                type="tel"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:border-coral-400"
                defaultValue="138****5678"
              />
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 px-1">偏好设置</h3>
          <div className="bg-white rounded-2xl p-5 shadow-soft-sm">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-600" htmlFor="daily-reminder">
                  每日提醒
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="daily-reminder" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-coral-400 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              <p className="text-gray-500 text-sm mt-1">在每天早上 9:00 发送提醒</p>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-600" htmlFor="weekly-summary">
                  周报告
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="weekly-summary" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-coral-400 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              <p className="text-gray-500 text-sm mt-1">每周日发送上周进度总结</p>
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-2" htmlFor="focus-time">
                专注时长
              </label>
              <div className="relative">
                <select
                  id="focus-time"
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 appearance-none focus:outline-none focus:border-coral-400"
                >
                  <option>25 分钟</option>
                  <option>30 分钟</option>
                  <option>45 分钟</option>
                  <option>60 分钟</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Account Section */}
        <section className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 px-1">账户管理</h3>
          <div className="bg-white rounded-2xl p-5 shadow-soft-sm">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <Lock className="w-5 h-5 text-gray-500 mr-3" />
                <span className="text-gray-700">修改密码</span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-gray-500 mr-3" />
                <span className="text-gray-700">通知设置</span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <Palette className="w-5 h-5 text-gray-500 mr-3" />
                <span className="text-gray-700">主题与外观</span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center">
                <Languages className="w-5 h-5 text-gray-500 mr-3" />
                <span className="text-gray-700">语言</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">简体中文</span>
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 px-1">隐私与安全</h3>
          <div className="bg-white rounded-2xl p-5 shadow-soft-sm">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-gray-500 mr-3" />
                <span className="text-gray-700">隐私政策</span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <FileContract className="w-5 h-5 text-gray-500 mr-3" />
                <span className="text-gray-700">用户协议</span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center">
                <Trash className="w-5 h-5 text-red-500 mr-3" />
                <span className="text-red-500">注销账号</span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* Logout Button */}
        <section className="mb-20">
          <button className="w-full py-3 bg-white rounded-2xl shadow-soft-sm text-red-500 font-medium">退出登录</button>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex flex-col items-center text-gray-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span className="text-xs mt-1">首页</span>
          </Link>
          <Link href="/challenges" className="flex flex-col items-center text-gray-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
            <span className="text-xs mt-1">使命</span>
          </Link>
          <div className="relative -mt-8">
            <Link
              href="/task-breakdown"
              className="w-14 h-14 rounded-full bg-coral-400 flex items-center justify-center shadow-lg"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>
          <Link href="/journal" className="flex flex-col items-center text-gray-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
            <span className="text-xs mt-1">日志</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-coral-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span className="text-xs mt-1">我的</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
