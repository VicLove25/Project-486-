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

| Sprint | Focus | Deadline |
|--------|--------|-----------|
| Sprint 1 | Task UI and subtasks | Sept 15 |
| Sprint 2 | Backend + Database | Oct 1 |
| Sprint 3 | Auth + User Profiles | Oct 15 |
| Sprint 4 | Polish + Docs + Demo | Oct 30 |

**MVP Deadline:** 🏁 **Nov 1**

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


