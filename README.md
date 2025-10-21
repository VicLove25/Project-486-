# UniTasker
# 🎓 UniTasker

## 🧠 TEAM PROFILE

**Team Name:** UniTasker  
**Mascot:** 🎓  

**GitHub Repo Name:** `unitasker`

**Team Directory:**  
`/docs/team.md`

---

### 👥 Team Members

| Name | Role | Major | Career Focus | Bio | Enneagram / MBTI | Team Insight |
|------|------|--------|---------------|------|------------------|--------------|
| **Spencer Blake** | Product Manager / Backend Dev | Information Technology | Cybersecurity & Software Development | Bridges technology and people through thoughtful design and security awareness. | Type 5 / ISTJ | Strong in planning and follow-through; occasionally overanalyzes details before acting. |
| **Victor Love** | Developer | CIS (Cyber Security Minor) | Cyber Security Analyst / IT Consultant | Focused on applying information systems knowledge to solve complex security challenges. | Enneagram Type: 3w4 | Good communicator and resilient worker. |

---

## 📘 README.md — MAIN ENTRY POINT

### **BLUF (Bottom Line Up Front)**

**What:** UniTasker — A Student Task Manager to organize main tasks & subtasks.  
**Who:** College students balancing academic and personal workloads.  
**Value:** Helps students break down complex tasks into actionable steps, reducing missed deadlines and task overwhelm.

---

## 🧩 PRODUCT OVERVIEW

### **User Story**
> As a student, I want to create main tasks (like “Graduate”) with subtasks (like “Buy cap and gown”) so I can stay organized and never miss important deadlines.

### **Minimum Acceptance Criteria**
- ✅ Create and delete main tasks  
- ✅ Add and delete subtasks dynamically  
- ✅ Persist tasks/subtasks across sessions (database or localStorage)  
- ✅ Responsive UI accessible on desktop and mobile  
- ✅ Secure authentication for user accounts  

### **Value / Knowledge Management Impact**
- Turns mental clutter into clear, trackable tasks  
- Reduces repetitive task creation with templates  
- Tracks progress metrics (e.g., % tasks completed before deadlines)  
- Saves students’ time and stress, increasing academic success  

---

## 🔗 KEY LINKS

| Link | Description |
|------|--------------|
| 📄 [Product Proposal](./docs/product-proposal.md) | Overview of goals and scope |
| 📑 [OpenAPI YAML](./api/openapi.yaml) | API specification |
| 🚀 Deployed Frontend URL | _Coming Soon_ |
| 🚀 Deployed API URL | _Coming Soon_ |
| 📚 [Wiki Home](../../wiki) | Team notes and documentation |
| 🗂 [GitHub Project Board](../../projects) | Task tracking and sprint planning |

---

## 🧱 REPO STRUCTURE

/
├── frontend/
├── backend/
├── docs/
│ ├── team.md
│ ├── system-design.md
│ └── ci-cd-guide.md
├── .github/
│ └── workflows/
│ └── ci.yml
├── README.md
├── api/
│ └── openapi.yaml

---


## 📚 DOCUMENTATION

Use `/docs/` for:
- System design documentation  
- Developer guides  
- CI/CD instructions  
- Accessibility and security policies  

Maintain the **Wiki** for:
- Team bios  
- Meeting notes  
- Retrospectives  

---

## 🧠 DEV TEAM PROCESS

### **Workflow**
- Daily standups (video or chat)
- All tasks managed as GitHub issues with labels (`dev`, `meeting`, `epic`)
- Flow:
- Issue --> Branch --> PR --> Code Review --> Dev Branch --> Main Branch (Production)

### **GitHub Settings**
- Protect main branch (no direct pushes)  
- Require code reviews before merging  
- Use `dev` branch for integration and staging deploys  

### **Meetings**
- Document meetings as GitHub issues with summaries  
- Use Slack/Discord for communication  

---

## 🧪 TESTING & DEPLOYMENT

| Environment | Branch | Deployment | Notes |
|--------------|---------|-------------|-------|
| **Staging** | `dev` | Render | Auto-deploy for testing |
| **Production** | `main` | Google Cloud | Auto-deploy to live site |

**Pull Requests must include:**
- Linked issue  
- Screenshots/videos for UI changes  
- Evidence of test success  

---

## 📦 PRODUCT FEATURES

| Feature | Status | Screenshot Example | Related Issue |
|----------|--------|--------------------|----------------|
| Create/Delete Tasks | ✅ Done | — | #4 |
| Add/Delete Subtasks | ✅ Done | — | #6 |
| Responsive Design | 🚧 In Development | — | #9 |

---

## 🎯 MILESTONES & SPRINTS

### 🗓️ UniTasker Project Timeline (October–November 2025)

| Week | Dates | Focus | Deliverables / Milestones |
|------|--------|--------|----------------------------|
| **Week 1** | Oct 20 – Oct 26 | **Setup & Planning** | ✅ Create GitHub repo and folders (`frontend/`, `backend/`, `docs/`) <br> ✅ Write `README.md` and `team.md` <br> ✅ Define user stories and acceptance criteria <br> ✅ Assign roles & setup GitHub Project Board |
| **Week 2** | Oct 27 – Nov 2 | **Frontend Prototype** | 🎨 Build UI mockups/wireframes <br> 🧱 Create basic HTML/CSS/JS structure (Bootstrap layout, nav bar) <br> 🧩 Add task/subtask input and list display <br> 🧠 Document progress in `/docs/system-design.md` |
| **Week 3** | Nov 3 – Nov 9 | **Backend & Data Storage** | ⚙️ Initialize Node.js + Express backend <br> 💾 Set up MongoDB connection or localStorage fallback <br> 🔌 Implement basic API routes (`GET`, `POST`, `DELETE`) <br> 🧱 Test with Postman or frontend fetch calls |
| **Week 4** | Nov 10 – Nov 16 | **Integration & Authentication** | 🔐 Add user authentication (JWT or session-based) <br> 🔄 Connect frontend to backend (task persistence) <br> 🧩 Test full CRUD flow from UI <br> 🪶 Update `/docs/ci-cd-guide.md` |
| **Week 5** | Nov 17 – Nov 25 | **Testing, Polish & Documentation** | 🧪 Finalize responsive design <br> 🪲 Fix bugs from testing <br> 📚 Complete documentation (`README`, Wiki, System Design) <br> 🎥 Prepare short demo or presentation video <br> 🚀 Optional: deploy staging site (Render/Netlify) |

---

### 🏁 End-of-November Goal (Nov 25)
✅ Fully functional **MVP (Minimum Viable Product)**:
- Users can create and delete tasks/subtasks  
- Tasks persist between sessions  
- UI works on desktop and mobile  
- Basic backend API running and tested  
- README, team.md, and system design docs complete  

---

## 🛡️ SECURITY, ETHICS & PRIVACY

| Aspect | Policy Highlights |
|--------|--------------------|
| **Authentication** | JWT tokens with refresh and expiry |
| **Personal Data** | Minimal PII, encryption at rest and in transit |
| **Backups** | Weekly encrypted backups |
| **Threats** | Protect against leaks, hijacks, spam |
| **Accessibility** | Screen reader support, focus states, high contrast |
| **Ethics** | Transparency, user control, consent for data use |

---

## 📊 SYSTEM DESIGN OVERVIEW

```mermaid
graph TD
  WebClient --> API
  API --> MongoDB
  API --> 3rdPartyServices


