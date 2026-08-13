import asyncio
import sys
import os
import uuid

sys.path.insert(0, r'c:\Users\sibel\source\repos\digital-twin-portfolio')

from sqlalchemy.ext.asyncio import AsyncSession
from src.db import session as db_session
from src.db.models import PortfolioSettings, Project, Service, Experience, Education

async def seed():
    # Ensure tables are created
    await db_session.init_db()

    async with db_session.SessionLocal() as session:
        # Settings
        settings = PortfolioSettings(
            id=str(uuid.uuid4()),
            full_name="Sibel Akkurt",
            title="Bilgisayar Mühendisi",
            title_en="Computer Engineer",
            hero_subtitle="Dijital İkiz Portfolyo",
            hero_subtitle_en="Digital Twin Portfolio",
            about_markdown="Merhaba, ben Sibel Akkurt. Yazılım geliştirme tutkusu olan bir mühendisim. Özellikle backend mimarileri ve yapay zeka entegrasyonları üzerinde çalışıyorum.",
            about_markdown_en="Hello, I am Sibel Akkurt. I am an engineer with a passion for software development. I specialize in backend architectures and AI integrations.",
            avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
            contact_email="sibelakk23@gmail.com",
            github_url="https://github.com/sibelakkurt",
            linkedin_url="https://linkedin.com/in/sibelakkurt",
            stats=[
                {"value": "1+", "label_tr": "Yıllık Deneyim", "label_en": "Years Experience"},
                {"value": "10+", "label_tr": "Tamamlanan Proje", "label_en": "Completed Projects"},
                {"value": "5+", "label_tr": "Sertifika", "label_en": "Certificates"}
            ]
        )
        session.add(settings)

        # Projects
        projects = [
            Project(
                id=str(uuid.uuid4()),
                title="Smart Memory AI (QABot)",
                title_en="Smart Memory AI (QABot)",
                summary="TÜBİTAK 2209-A & SAAS",
                summary_en="TÜBİTAK 2209-A & SAAS",
                description="Özel veritabanları üzerinde çalışan, yapay zeka destekli soru-cevap asistanı.",
                description_en="AI-powered Q&A assistant running on custom databases.",
                image_url="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
                github_url="#",
                live_url="https://example.com",
                technologies=["Python", "React", "AI"]
            ),
            Project(
                id=str(uuid.uuid4()),
                title="StoreFlow ERP",
                title_en="StoreFlow ERP",
                summary="ASP.NET CORE",
                summary_en="ASP.NET CORE",
                description="Gelişmiş stok yönetimi ve faturalandırma için kapsamlı ERP sistemi.",
                description_en="Comprehensive ERP system for advanced stock management and billing.",
                image_url="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
                github_url="#",
                live_url=None,
                technologies=["ASP.NET", "C#", "SQL"]
            ),
            Project(
                id=str(uuid.uuid4()),
                title="İş Analitiği Platformu",
                title_en="Business Analytics Platform",
                summary="React & Python",
                summary_en="React & Python",
                description="Büyük verileri anlamlı grafiklere dönüştüren veri görselleştirme paneli.",
                description_en="Data visualization dashboard turning big data into meaningful charts.",
                image_url="https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&w=800&q=80",
                github_url="#",
                live_url=None,
                technologies=["React", "Python"]
            ),
            Project(
                id=str(uuid.uuid4()),
                title="Akıllı Depo Yönetimi",
                title_en="Smart Warehouse Management",
                summary="IoT & FastAPI",
                summary_en="IoT & FastAPI",
                description="IoT cihazlarıyla entegre çalışan gerçek zamanlı depo izleme sistemi.",
                description_en="Real-time warehouse tracking system integrated with IoT devices.",
                image_url="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
                github_url="#",
                live_url=None,
                technologies=["IoT", "FastAPI"]
            )
        ]
        session.add_all(projects)

        # Services
        services = [
            Service(
                id=str(uuid.uuid4()),
                title="Web Geliştirme",
                title_en="Web Development",
                description="Modern, hızlı ve responsive web uygulamaları.",
                description_en="Modern, fast and responsive web applications.",
                icon_name="Code2",
                detailed_description="React, Vue, ve modern araçlarla sıfırdan geliştirilen...",
                detailed_description_en="Developed from scratch using React, Vue..."
            ),
            Service(
                id=str(uuid.uuid4()),
                title="Yapay Zeka Çözümleri",
                title_en="AI Solutions",
                description="LLM tabanlı akıllı asistanlar ve otomasyonlar.",
                description_en="LLM based smart assistants and automations.",
                icon_name="Wrench",
                detailed_description="OpenAI, LangChain kullanarak kurumsal süreçleri otomatize eden sistemler...",
                detailed_description_en="Automating corporate processes using OpenAI, LangChain..."
            ),
            Service(
                id=str(uuid.uuid4()),
                title="Veritabanı Yönetimi",
                title_en="Database Management",
                description="Güvenli ve ölçeklenebilir veritabanı mimarileri.",
                description_en="Secure and scalable database architectures.",
                icon_name="Layers",
                detailed_description="PostgreSQL, MongoDB gibi sistemlerle performans odaklı çözümler...",
                detailed_description_en="Performance oriented solutions with PostgreSQL, MongoDB..."
            )
        ]
        session.add_all(services)

        # Experience
        experiences = [
            Experience(
                id=str(uuid.uuid4()),
                company="Tech Co",
                position="Yazılım Geliştirici",
                position_en="Software Developer",
                start_date="2023-01-01",
                end_date="Devam Ediyor",
                description="Backend sistemlerinin geliştirilmesi.",
                description_en="Development of backend systems.",
                technologies=["Python", "FastAPI", "React"]
            ),
            Experience(
                id=str(uuid.uuid4()),
                company="Digital Agency",
                position="Stajyer Mühendis",
                position_en="Intern Engineer",
                start_date="2022-06-01",
                end_date="2022-09-01",
                description="Web tabanlı projelerde görev alma.",
                description_en="Taking part in web-based projects.",
                technologies=["HTML", "CSS", "JavaScript"]
            )
        ]
        session.add_all(experiences)

        # Education
        educations = [
            Education(
                id=str(uuid.uuid4()),
                school="Karadeniz Teknik Üniversitesi",
                school_en="Karadeniz Technical University",
                degree="Bilgisayar Mühendisliği",
                degree_en="Computer Engineering",
                start_date="2019-09-01",
                end_date="2024-06-01",
                description="Yazılım Geliştirme ve Yapay Zeka alanlarında uzmanlaşma.",
                description_en="Specialization in Software Development and AI."
            )
        ]
        session.add_all(educations)

        await session.commit()
        print("Database successfully seeded with default portfolio data!")

if __name__ == "__main__":
    asyncio.run(seed())
