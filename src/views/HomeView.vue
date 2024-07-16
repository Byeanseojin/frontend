<template>
  <div class="home">
    <div class="header">
      <span class="logo">로고</span>
      <span v-if="isLoggedIn" class="user-info">
        ❣️{{ userName }}님 이용해 주셔서 감사합니다❣️ / <span @click="logout" id="logoutBtn">로그아웃</span>
      </span>
      <span v-else class="homeLogin">
        <span @click="goToLogin" id="loginBtn">로그인</span>
        <span @click="goToSignup" id="signupBtn">회원가입</span>
      </span>
    </div>
    <div class="main-content">
      <div class="content-left">BeforeTranslation</div>
      <div class="content-right">AfterTranslation</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const isLoggedIn = ref(false);

    const state = reactive({
      account: {
        id: null,
        name: "",
      },
    });

    const checkLoginStatus = async () => {
      try {
        const res = await axios.get("/api/account");
        if (res.data && res.data.id) {
          state.account = res.data;
          isLoggedIn.value = true;
        } else {
          isLoggedIn.value = false;
        }
      } catch (error) {
        console.error("로그인 상태 확인 중 오류 발생:", error);
        isLoggedIn.value = false;
      }
    };

    onMounted(checkLoginStatus);

    const userName = computed(() => state.account.name);

    const logout = () => {
      try {
        localStorage.removeItem('accessToken');
        alert("로그아웃하였습니다.");
        state.account.id = null;
        state.account.name = "";
        isLoggedIn.value = false;
      } catch (error) {
        console.error("로그아웃 중 오류 발생:", error);
      }
    };

    const goToLogin = () => {
      router.push("/login");
    };

    const goToSignup = () => {
      router.push("/signup");
    };

    return { userName, logout, isLoggedIn, goToLogin, goToSignup };
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: white;
}

.logo {
  background-color: #4679BD;
  padding: 10px 20px;
  border-radius: 10px;
  color: white;
}

.homeLogin span {
  margin-left: 10px;
  cursor: pointer;
  color: #4679BD;
}

.main-content {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  margin: 60px 100px;
  min-height: 80vh;
}

.content-left,
.content-right {
  background-color: #4679BD;
  width: 48%;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

@media (max-width: 799px) {
  .main-content {
    flex-direction: column;
    margin: 20px;
  }

  .content-left,
  .content-right {
    width: 100%;
    margin-bottom: 20px;
    height: 250px;
  }
}
</style>
