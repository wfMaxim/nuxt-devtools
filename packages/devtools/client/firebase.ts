import type { FirebaseApp } from 'firebase/app'
import { initializeApp } from 'firebase/app'
import type { Auth } from 'firebase/auth'
import { getAuth } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDAPYzTIZ7p1raFAozYbkZjC1jLnVCc_ks',
  authDomain: 'wallfar-cms.firebaseapp.com',
  databaseURL: 'https://wallfar-cms.firebaseio.com',
  projectId: 'wallfar-cms',
  storageBucket: 'wallfar-cms.appspot.com',
  messagingSenderId: '617497523868',
  appId: '1:617497523868:web:2128e41c8aa0c0c1079f59',
  measurementId: 'G-C5EMW3SYZ6',
}

const projectId: string = firebaseConfig.projectId
const app: FirebaseApp = initializeApp(firebaseConfig)
const auth: Auth = getAuth()
const db: Firestore = getFirestore(app)

export { projectId, app, auth, db }
