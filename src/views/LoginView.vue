<template>
  <div class="page-container">
    <div class="header-container">
      <router-link to="/" class="logo-link">
        <span class="logo"></span>
      </router-link>
    </div>
    <div class="login-container">
      <form @submit.prevent="submit" class="login-form">
        <label for="email">
          <span>이메일</span>
          <input type="text" id="email" placeholder="aaa@example" v-model="state.form.email" />
        </label>
        <label for="password">
          <span>패스워드</span>
          <input type="password" id="password" v-model="state.form.password" />
        </label>
        <hr />
        <button type="submit" id="loginBtn">로그인</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { reactive } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    const state = reactive({
      form: {
        email: "",
        password: "",
      },
    });

    const submit = async () => {
      try {
        const data = await axios.post("/api/login", state.form, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (data.headers.accesstoken) {
          localStorage.setItem('accesstoken', data.headers.accesstoken);
          localStorage.setItem('name', data.data.name);
          localStorage.setItem('items', JSON.stringify(data.data.items));
          alert("로그인에 성공했습니다.");
          router.push('/');
        } else {
          alert("로그인에 실패했습니다. 응답에 토큰이 없습니다.");
        }
      } catch (error) {
        if (error.response) {
          switch (error.response.status) {
            case 401:
              alert("사용자를 찾을 수 없습니다. 이메일을 확인해주세요.");
              break;
            case 403:
              alert("비밀번호가 일치하지 않습니다.");
              break;
            case 500:
              alert("서버에서 예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
              break;
            default:
              alert("로그인에 실패했습니다. 계정 정보를 확인해주세요.");
          }
        } else {
          alert("로그인에 실패했습니다. 네트워크 상태를 확인해주세요.");
        }
      }
    };

    return { state, submit };
  },
};
</script>

<style>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header-container {
  text-align: center;
  padding: 20px 0;
  background-color: none;
}

.logo-link {
  display: inline-block;
  cursor: pointer;
}

.logo {
  background-image: url('../assets/logo.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 300px;
  height: 80px;
  display: inline-block;
}

.login-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-form {
  background-color: #fff;
  color: #495f7a;
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

label {
  display: block;
  margin-bottom: 15px;
}

label span {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"], 
input[type="password"] {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

hr {
  margin: 20px 0;
  border: none;
  border-top: 1px solid #eee;
}

#loginBtn {
  width: 100%;
  padding: 12px;
  background-color: #4679BD;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

#loginBtn:hover {
  background-color: #0056b3;
}
</style>
