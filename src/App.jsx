import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import RoadmapPage from './pages/RoadmapPage';
import PatternsPage from './pages/PatternsPage';
import ProblemBankPage from './pages/ProblemBankPage';
import SystemDesignPage from './pages/SystemDesignPage';
import TrackMatrix from './components/TrackMatrix';
import TrackSelector from './components/TrackSelector';
import AuthModal from './components/AuthModal';
import { api } from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTrack, setCurrentTrack] = useState('intermediate');
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [user, setUser] = useState(null);

  // Check existing session on boot
  useEffect(() => {
    const token = api.getToken();
    if (token) {
      api.getMe()
        .then((res) => {
          if (res && res.user) {
            setCurrentUser(res.user);
            setCurrentTrack(res.user.currentTrack || 'intermediate');
          }
        })
        .catch(() => {
          api.logout();
          setCurrentUser(null);
        });
    }
  }, []);

  const loadUser = async () => {
    try {
      const plan = await api.getDailyPlan();
      if (plan && plan.user) {
        setUser(plan.user);
        setCurrentTrack(plan.user.currentTrack || 'intermediate');
      }
    } catch (err) {
      console.warn('Backend not ready yet, using default track:', err.message);
    }
  };

  useEffect(() => {
    loadUser();
  }, [currentUser]);

  const handleSelectTrack = async (newTrack) => {
    try {
      await api.updateSettings({ currentTrack: newTrack });
      setCurrentTrack(newTrack);
      if (currentUser) {
        setCurrentUser(prev => prev ? { ...prev, currentTrack: newTrack } : null);
      }
      await loadUser();
    } catch (err) {
      alert('Failed to switch track: ' + err.message);
    }
  };

  const handleAuthSuccess = (authUser) => {
    setCurrentUser(authUser);
    if (authUser.currentTrack) {
      setCurrentTrack(authUser.currentTrack);
    }
    loadUser();
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setCurrentTrack('intermediate');
    loadUser();
  };

  const userKey = currentUser?.userId || 'guest';

  return (
    <div>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentTrack={currentTrack}
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="app-container">
        {activeTab === 'dashboard' && (
          <Dashboard
            key={userKey}
            onOpenTrackModal={() => setIsTrackModalOpen(true)}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapPage
            key={userKey}
            currentTrack={currentTrack}
            onOpenTrackModal={() => setIsTrackModalOpen(true)}
          />
        )}

        {activeTab === 'patterns' && (
          <PatternsPage key={userKey} />
        )}

        {activeTab === 'system-design' && (
          <SystemDesignPage key={userKey} />
        )}

        {activeTab === 'problems' && (
          <ProblemBankPage key={userKey} />
        )}

        {activeTab === 'matrix' && (
          <TrackMatrix key={userKey} />
        )}
      </main>

      <TrackSelector
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        currentTrack={currentTrack}
        onSelectTrack={handleSelectTrack}
        totalDays={user?.totalDays || 100}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
