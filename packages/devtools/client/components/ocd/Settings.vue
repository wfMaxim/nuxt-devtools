<script setup lang="ts">
import { ref } from 'vue'

// AUTHENTICATION
import { signInWithEmailAndPassword } from 'firebase/auth'

// PROJECTS
import { collection, getDocs, query, where } from 'firebase/firestore'
import { auth, db } from '@/firebase'

const isLoggedIn = ref(auth.currentUser !== null)
const email = ref(localStorage.getItem('ocd-username') || '')
const password = ref('')
function login() {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      localStorage.setItem('ocd-username', email.value)

      isLoggedIn.value = true
      getProjects()
    })
}
const projects = ref([])
const linkedProject = ref(-1)
getProjects()
async function getProjects() {
  if (!auth.currentUser)
    return

  const q = query(collection(db, 'Projects'), where('collaborators', 'array-contains', auth.currentUser.uid))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    projects.value.push({ id: doc.id, ...doc.data() })
  })

  projects.value = projects.value.sort((a, b) => {
    if (a.displayName < b.displayName)
      return -1
    if (a.displayName > b.displayName)
      return 1
    return 0
  })
}
</script>

<template>
  <SettingsFab>
    <h2>Connect project</h2>

    <div v-if="!isLoggedIn">
      <p>
        First, sign in with your oneclick.dev account.
      </p>

      <NTextInput
        placeholder="E-mail"
        icon="carbon-email"
        n="primary" flex-auto
        class="mb-2 px-5 py-3"
        :value="email"
        @change="email = $event.target.value"
      />
      <NTextInput
        placeholder="Password"
        icon="carbon-password"
        n="primary" flex-auto
        class="mb-4 px-5 py-3"
        type="password"
        :value="password"
        @change="password = $event.target.value"
      />
      <NButton n="primary" class="px-5 py-3" @click="login">
        Log in
      </NButton>
    </div>

    <div v-else>
      <p>You're logged in as <b>{{ auth.currentUser.email }}</b>.</p>

      <div mx--2 my1 h-1px border="b base" op75 />
      <p>Link website to CMS project</p>
      <NSelect v-model="linkedProject" n="primary" class="mb-4 px-5 py-3">
        <option :value="-1">
          None
        </option>
        <option v-for="p of projects" :key="p.id" :value="p.id">
          {{ p.displayName }}
        </option>
      </NSelect>

      <NButton n="primary" class="px-5 py-3">
        Update
      </NButton>
    </div>
  </SettingsFab>
</template>
