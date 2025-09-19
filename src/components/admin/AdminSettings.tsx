'use client'

import { useState, useEffect } from 'react'

interface AdminSetting {
  id: string
  setting_key: string
  setting_value: string | null
  description: string | null
  updated_by_user_id: string | null
  created_at: string
  updated_at: string
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<AdminSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      const data = await response.json()

      if (data.success) {
        setSettings(data.data)
        const initialValues: Record<string, string> = {}
        data.data.forEach((setting: AdminSetting) => {
          initialValues[setting.setting_key] = setting.setting_value || ''
        })
        setValues(initialValues)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSetting = async (settingKey: string) => {
    setSaving(settingKey)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settingKey,
          settingValue: values[settingKey],
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Reload settings to get updated data
        await loadSettings()
      } else {
        alert('Error saving setting: ' + data.error)
      }
    } catch (error) {
      console.error('Error saving setting:', error)
      alert('Error saving setting')
    } finally {
      setSaving(null)
    }
  }

  const handleValueChange = (settingKey: string, value: string) => {
    setValues(prev => ({
      ...prev,
      [settingKey]: value
    }))
  }

  const getInputType = (settingKey: string) => {
    if (settingKey.includes('api_key')) return 'password'
    if (settingKey.includes('email')) return 'email'
    if (settingKey.includes('url')) return 'url'
    return 'text'
  }

  const getDisplayName = (settingKey: string) => {
    return settingKey
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Settings</h2>
        <div className="text-gray-600">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Admin Settings</h2>

      <div className="space-y-6">
        {settings.map((setting) => (
          <div key={setting.id} className="border-b border-gray-200 pb-6 last:border-b-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 mr-4">
                <label
                  htmlFor={setting.setting_key}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {getDisplayName(setting.setting_key)}
                </label>
                {setting.description && (
                  <p className="text-sm text-gray-500 mb-3">{setting.description}</p>
                )}
                <input
                  type={getInputType(setting.setting_key)}
                  id={setting.setting_key}
                  value={values[setting.setting_key] || ''}
                  onChange={(e) => handleValueChange(setting.setting_key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={`Enter ${getDisplayName(setting.setting_key).toLowerCase()}`}
                />
              </div>
              <button
                onClick={() => saveSetting(setting.setting_key)}
                disabled={saving === setting.setting_key}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving === setting.setting_key ? 'Saving...' : 'Save'}
              </button>
            </div>

            {setting.updated_at && (
              <div className="mt-2 text-xs text-gray-400">
                Last updated: {new Date(setting.updated_at).toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Important Notes:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• The Global PNW API Key is required for alliance search functionality</li>
          <li>• You can get a PNW API key from your Politics and War account settings</li>
          <li>• Changes take effect immediately after saving</li>
        </ul>
      </div>
    </div>
  )
}