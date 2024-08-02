<template>
  <div class="home">
    <div class="header-container">
      <span class="logo"></span>
    </div>
    <nav class="navigation-bar">
      <span @click="goToGitHub" id="githubLink" class="nav-left">프로젝트 소개</span>
      <span v-if="isLoggedIn" class="user-info nav-right">
        ❣️{{ userName }}님 이용해 주셔서 감사합니다❣️
        <span @click="logout" id="logoutBtn" class="nav-button">로그아웃</span>
        <span @click="goToDeleteAccount" id="deleteAccountBtn" class="nav-button">회원탈퇴</span>
      </span>
      <span v-else class="nav-login nav-right">
        <span @click="goToLogin" id="loginLink" class="nav-button">로그인</span>
        <span @click="goToSignup" id="signupLink" class="nav-button">회원가입</span>
      </span>
    </nav>
    <div class="main-content">
      <div class="MZLanguage-box">
        <h2>MZ어</h2>
        <textarea 
          v-model="slang" 
          @keyup.enter="handleEnter"
          @keydown.enter.prevent
        ></textarea>
        <div class="button-container">
          <button 
            class="translate-btn" 
            @click="translate" 
            :disabled="isTranslating"
          >
            {{ isTranslating ? '번역 중...' : '번역하기' }}
          </button>
        </div>
      </div>
      <div class="translated-box">
        <h2>번역어</h2>
        <textarea v-model="standard" readonly></textarea>
      </div>
    </div>
    <div v-if="isLoggedIn" class="recent-translations">
      <h2>최근 번역 기록</h2>
      <ul>
        <li v-for="(translation, index) in items" :key="index">
          <div>번역 전: {{ translation.slang }}</div>
          <div>번역 후: {{ translation.standard }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from 'axios';

export default {
  setup() {
    const router = useRouter();
    const isLoggedIn = ref(false);
    const userName = ref("");
    const slang = ref("");
    const standard = ref("");
    const items = ref([]);
    const isTranslating = ref(false);

    const checkLoginStatus = () => {
      const token = localStorage.getItem('accesstoken');
      const name = localStorage.getItem('name');
      const savedItems = localStorage.getItem('items');
      if (token && name) {
        isLoggedIn.value = true;
        userName.value = name;

        try {
          items.value = JSON.parse(savedItems) || [];
        } catch (error) {
          items.value = [];
        }
      } else {
        isLoggedIn.value = false;
        userName.value = "";
        items.value = [];
      }
    };

    onMounted(checkLoginStatus);

    const logout = () => {
      localStorage.removeItem('accesstoken');
      localStorage.removeItem('name');
      localStorage.removeItem('items');
      isLoggedIn.value = false;
      userName.value = "";
      items.value = [];
      alert("로그아웃하였습니다.");
    };

    const goToLogin = () => {
      router.push("/login");
    };

    const goToSignup = () => {
      router.push("/signup");
    };

    const goToGitHub = () => {
      window.open('https://github.com/teamMZtoX', '_blank');
    };

    const goToDeleteAccount = () => {
      router.push("/deleteaccount");
    };

    const translate = async () => {
      if (!slang.value.trim()) {
        alert("번역할 내용을 입력해주세요.");
        return;
      }
      isTranslating.value = true;
      try {
        let response;
        if (!isLoggedIn.value) {
          response = await axios.post('/aiapi/v1/translate', {
            content: slang.value
          });
          standard.value = response.data.content;
        } else {
          response = await axios.post('/api/main',
            { slang: slang.value },
            {
              headers: { accesstoken: localStorage.getItem('accesstoken') }
            }
          );
          standard.value = response.data.standard;

          const newTranslation = {
            slang: slang.value,
            standard: response.data.standard
          };
          items.value = [newTranslation, ...items.value];

          if (items.value.length > 5) {
            items.value = items.value.slice(0, 5);
          }

          localStorage.setItem('items', JSON.stringify(items.value));
        }
      } catch (error) {
        alert("번역에 실패했습니다. 다시 시도해주세요.");
      } finally {
        isTranslating.value = false;
      }
    };

    const handleEnter = (event) => {
      if (!isTranslating.value) {
        translate();
      }
      event.preventDefault();
    };

    return {
      userName,
      logout,
      isLoggedIn,
      goToLogin,
      goToSignup,
      goToGitHub,
      goToDeleteAccount,
      slang,
      standard,
      translate,
      items,
      isTranslating,
      handleEnter
    };
  },
};
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
}

.home {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: white;
}

.logo {
  background-image: url('../assets/logo.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 300px;
  height: 100px;
}

.navigation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}

.nav-left {
  margin-right: auto;
  cursor: pointer;
  color: #5d7eaad0;
}

.nav-right {
  display: flex;
  align-items: center;
}

.nav-button {
  margin-left: 10px;
  cursor: pointer;
  color: #538ad1;
}

.nav-button:active {
    color: #386698;
  }

.main-content {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  margin: 150px 100px 20px 100px;
  min-height: 50vh;
}

.MZLanguage-box {
  background-color: white;
  width: 48%;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 2px solid #4679BD;
}

.translated-box {
  background-color: white;
  width: 48%;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  padding: 20px 20px 50px 20px;
  border: 2px solid #4679BD;
}

.MZLanguage-box {
  position: relative;
  padding-bottom: 50px;
  margin-right: 50px;
}

h2 {
  color: #4679BD;
  margin-bottom: 10px;
}

textarea {
  flex-grow: 1;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 25px;
  resize: none;
  font-size: 1.5em;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.button-container {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.translate-btn {
  background-color: #f8b7d0dc;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  color: black;
  cursor: pointer;
  width: auto;
  white-space: nowrap;
}

.translate-btn:hover {
  background-color: #f7b0cc;
}

.translate-btn:active {
  background-color: #fc90b9dc;
}

.recent-translations {
  margin: 20px 100px;
  padding: 20px;
  background-color: white;
  border: 2px solid #4679BD;
  border-radius: 20px;
}

.recent-translations h2 {
  color: #4679BD;
  margin-bottom: 10px;
}

.recent-translations ul {
  list-style-type: none;
  padding: 0;
}

.recent-translations li {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
}

@media (max-width: 799px) {
  .main-content {
    flex-direction: column;
    margin: 0px 60px 0px 15px;
  }

  .MZLanguage-box,
  .translated-box {
    width: 100%;
    margin: 0px 0px 30px 0px;
    height: 250px;
  }
}
</style>