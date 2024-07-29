<template>
  <div class="home">
    <div class="header-container">
      <span class="logo"></span>
    </div>
    <nav class="navigation-bar">
      <span v-if="isLoggedIn" class="user-info">
        ❣️{{ userName }}님 이용해 주셔서 감사합니다❣️
        <span @click="logout" id="logoutBtn">로그아웃</span>
      </span>
      <span v-else class="nav-login">
        <span @click="goToLogin" id="loginLink">로그인</span>
        <span @click="goToSignup" id="signupLink">회원가입</span>
      </span>
    </nav>
    <div class="main-content">
      <div class="MZLanguage-box">
        <h2>MZ어</h2>
        <textarea v-model="slang"></textarea>
        <div class="button-container">
          <button class="translate-btn" @click="translate">번역하기</button>
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
        <li v-for="(translation, index) in recentTranslations" :key="index">{{ translation }}</li>
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


    const checkLoginStatus = () => {
      const token = localStorage.getItem('accesstoken');
      const name = localStorage.getItem('name');
      if (token && name) {
        isLoggedIn.value = true;
        userName.value = name;
      } else {
        isLoggedIn.value = false;
        userName.value = "";
      }
    };

    onMounted(checkLoginStatus);

    const logout = () => {
      localStorage.removeItem('accesstoken');
      localStorage.removeItem('userName');
      isLoggedIn.value = false;
      userName.value = "";
      alert("로그아웃하였습니다.");
    };

    const goToLogin = () => {
      router.push("/login");
    };

    const goToSignup = () => {
      router.push("/signup");
    };

    const translate = async () => {
      try {
        let response;
        if (localStorage.getItem('accesstoken') == null){
          response = await axios.post('/aiapi/v1/translate', 
        {
          content: slang.value
        }
      )
      standard.value = response.data.content;

        }
        else{
         response = await axios.post('/api/main', 
        {
          slang: slang.value
        },
        {
          headers : {accesstoken: localStorage.getItem('accesstoken')}
        }
      );
      standard.value = response.data.standard;
    }
        
      } catch (error) {
        console.error("번역 중 오류 발생:", error);
        alert("번역에 실패했습니다. 다시 시도해주세요.");
      }
  };

    return { 
      userName, 
      logout, 
      isLoggedIn, 
      goToLogin, 
      goToSignup, 
      slang, 
      standard, 
      translate 
    };
  },
};
</script>

<style>
body, html {
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
  justify-content: center; /* 로고를 좌우 중앙으로 정렬 */
  align-items: center;
  padding: 20px;
  background-color: white;
}

.logo {
  background-image: url('../assets/logo.png');
  background-size: contain; /* 이미지가 요소 안에 맞도록 조정 */
  background-repeat: no-repeat; /* 이미지 반복 안 함 */
  background-position: center; /* 이미지 중앙에 배치 */
  width: 300px;  /* 원하는 크기로 설정 */
  height: 100px;  /* 원하는 크기로 설정 */
}

.navigation-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px 20px;
}

.nav-login span, #logoutBtn {
  margin-left: 10px;
  cursor: pointer;
  color: #4679BD;
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
  padding-bottom: 50px; /* 버튼을 위한 공간 확보 */
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
  background-color: #FFC0CB;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  color: black;
  cursor: pointer;
  width: auto; /* 내용에 맞게 너비 조정 */
  white-space: nowrap; /* 텍스트가 한 줄로 유지되도록 함 */
}

.translate-btn:hover {
  background-color: #f8a2b0; /* 마우스 오버 시 배경색 변경 */
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

  .MZLanguage-box, .translated-box {
    width: 100%;
    margin:0px 0px 30px 0px;    
    height: 250px;
  }


}

</style>