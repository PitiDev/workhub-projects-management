project-management/
├── assets/
│   └── css/
│       └── main.css
├── components/
│   ├── auth/
│   │   ├── LoginForm.vue
│   │   └── RegisterForm.vue
│   ├── common/
│   │   ├── AppHeader.vue
│   │   ├── AppSidebar.vue
│   │   ├── ConfirmDialog.vue
│   │   └── Loader.vue
│   ├── projects/
│   │   ├── ProjectCard.vue
│   │   ├── ProjectForm.vue
│   │   └── ProjectStatusColumn.vue
│   ├── tasks/
│   │   ├── TaskCard.vue
│   │   ├── TaskDetail.vue
│   │   ├── TaskForm.vue
│   │   └── TaskComment.vue
│   └── teams/
│       ├── TeamCard.vue
│       └── TeamMembersList.vue
├── composables/
│   ├── useAuth.ts
│   ├── useProjects.ts
│   ├── useTasks.ts
│   └── useTeams.ts
├── layouts/
│   ├── auth.vue
│   └── default.vue
├── middleware/
│   └── auth.ts
├── pages/
│   ├── auth/
│   │   ├── login.vue
│   │   └── register.vue
│   ├── index.vue
│   ├── projects/
│   │   ├── index.vue
│   │   ├── [id]/
│   │   │   ├── index.vue
│   │   │   └── settings.vue
│   │   └── new.vue
│   ├── tasks/
│   │   ├── [id].vue
│   │   └── index.vue
│   └── teams/
│       ├── index.vue
│       └── [id].vue
├── plugins/
│   ├── axios.ts
│   └── socket.ts
├── stores/
│   ├── auth.ts
│   ├── projects.ts
│   ├── tasks.ts
│   └── teams.ts
├── types/
│   ├── auth.ts
│   ├── project.ts
│   ├── task.ts
│   └── team.ts
├── utils/
│   ├── date.ts
│   └── notifications.ts
├── nuxt.config.ts
├── package.json
└── tsconfig.json