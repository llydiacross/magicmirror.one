import React, { useEffect, useState } from 'react'
import { apiFetch } from '../api'
import storage from '../storage'
import config from '../config'
import FixedElements from '../components/FixedElements'
import SettingsModal from '../modals/SettingsModal'

export default function Leaderboard() {
	const [stats, setStats] = useState([])
	const [showSettingsModal, setShowSettingsModal] = useState(false);

	let getAllStats = async () => {
		const result = await apiFetch('stats', 'top', {}, 'GET')
			.then(result => result.json())

		setStats(result || [])
	}
	return <div
		data-theme={
			storage.getGlobalPreference('defaultTheme') ||
			config.defaultTheme ||
			'forest'
		}
	>


		<FixedElements onSettings={() => {
			setShowSettingsModal(true)
		}} />
		<SettingsModal hidden={!showSettingsModal} onHide={() => {
			setShowSettingsModal(false);
		}} />
	</div>
}
