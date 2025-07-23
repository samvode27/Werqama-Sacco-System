import React, { useContext } from 'react';
import NavigationBar from '../components/Navbar';
import { Container, Button } from 'react-bootstrap';
import { LanguageContext } from '../contexts/LanguageContext';
import '../styles/Dashboard.css';

const HomePage = () => {
    const { language } = useContext(LanguageContext);

    return (
        <>
            <NavigationBar />
            <Container className="dashboard-container">
                <div className="hero">
                    <h1>
                        {language === 'en' ? 'Welcome to WERQAMA SACCO' : 'እንኳን ወደ ወርቃማ ባለቤት ማህበር በደህና መጡ'}
                    </h1>
                    <p>
                        {language === 'en'
                            ? 'Empowering members with savings and credit for a brighter future.'
                            : 'አባላቶችን በቁጠባና ብድር በታማኝነት ወደ ፀጋ የተሞላ ወደፊት እንዲገቡ ማግደል።'}
                    </p>
                    <Button className="btn-cta mt-3">
                        {language === 'en' ? 'Join Now' : 'ይቀላቀሉ'}
                    </Button>
                </div>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-title">{language === 'en' ? 'Total Members' : 'አባላት በሙሉ'}</div>
                        <div className="stat-value">1,250</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-title">{language === 'en' ? 'Active Loans' : 'እየተካፈሉ ያሉ ብድሮች'}</div>
                        <div className="stat-value">430</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-title">{language === 'en' ? 'Total Savings' : 'በሙሉ ቁጠባ'}</div>
                        <div className="stat-value">ETB 2.3M</div>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default HomePage;
