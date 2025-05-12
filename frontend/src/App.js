import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [view, setView] = useState('login'); // 預設進入儀表板
    const [plan, setPlan] = useState(null);
    const [progress, setProgress] = useState([]);
    const [authLoading, setAuthLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

  const register = async () => {
    console.log('Register data:', { username, password });
    try {
      await axios.post(`${backendUrl}/register`, { username, password }, { withCredentials: true });
      alert('註冊成功');
    } catch (error) {
      console.error('Register error:', error.message, error.response?.data);
      alert(`註冊失敗: ${error.message}`);
    }
  };

  const login = async () => {
    console.log('Login data:', { username, password });
    try {
      await axios.post(`${backendUrl}/login`, { username, password }, { withCredentials: true });
      alert('登入成功');
    } catch (error) {
      console.error('Login error:', error.message, error.response?.data);
      alert(`登入失敗: ${error.message}`);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${backendUrl}/logout`, {}, { withCredentials: true });
      alert('登出成功');
    } catch (error) {
      console.error('Logout error:', error.message, error.response?.data);
      alert(`登出失敗: ${error.message}`);
    }
  };

  const generatePlan = async () => {
    console.log('Generate plan data:', { goal }); // 新增日誌
    try {
      const response = await axios.post(`${backendUrl}/generate_plan`, { goal }, { withCredentials: true });
      setPlan(response.data.plan);
      alert('生成計畫成功');
    } catch (error) {
      console.error('Generate plan error:', error.message, error.response?.data);
      alert(`生成計畫失敗: ${error.message}`);
    }
  };

    const getProgress = async () => {
        setDataLoading(true);
        try {
            const response = await apiClient.get('/learning_progress');
            setProgress(response.data || []);
        } catch (error) {
            toast.error('獲取進度失敗');
            setProgress([]);
        } finally {
            setDataLoading(false);
        }
    };

    useEffect(() => {
        getProgress();
    }, []);

    const renderView = () => {
        switch (view) {
            case 'register':
                return <RegisterPage setView={setView} handleRegister={handleRegister} loading={authLoading} />;
            case 'lecture':
                return selectedPlan && (
                    <LecturePage
                        planId={selectedPlan.planId}
                        planContent={selectedPlan.planContent}
                        setView={setView}
                    />
                );
            case 'dashboard':
                return (
                    <DashboardPage
                        handleLogout={handleLogout}
                        generatePlan={generatePlan}
                        getProgress={getProgress}
                        progress={progress}
                        plan={plan}
                        loading={dataLoading}
                        authLoading={authLoading}
                        setView={(view, planData) => {
                            setView(view);
                            if (planData) setSelectedPlan(planData);
                        }}
                    />
                );
            case 'login':
            default:
                return <LoginPage setView={setView} handleLogin={handleLogin} loading={authLoading} />;
        }
    };

    return (
        <div className="app-container" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
            <Toaster />
            <div className="content-wrapper">
                <motion.h1
                    className="main-title text-center mb-4 h2"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    AI 個人化學習助手
                </motion.h1>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={view}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        className="motion-div-wrapper"
                    >
                        {renderView()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default App;