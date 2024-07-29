네, 이해했습니다. 귀하가 제시한 구조를 바탕으로 회원가입 폼을 수정하겠습니다. 다음은 요청하신 구조로 변경된 코드입니다:
vueCopy<template>
  <div class="page-container">
    <div class="header-container">
      <span class="logo"></span>
    </div>
    <div class="signup-container">
      <form @submit.prevent="submit" class="signup-form">
        <label for="email">
          <span>이메일</span>
          <input type="text" id="email" placeholder="aaa@example.com" v-model="state.form.email" @blur="validateEmail" />
          <span v-if="state.emailError" class="error-message">{{ state.emailError }}</span>
        </label>
        <label for="password">
          <span>패스워드</span>
          <input type="password" id="password" v-model="state.form.password" @blur="validatePassword" />
          <span v-if="state.passwordError" class="error-message">{{ state.passwordError }}</span>
        </label>
        <label for="name">
          <span>이름</span>
          <input type="text" id="name" v-model="state.form.name" @blur="validateName" />
          <span v-if="state.nameError" class="error-message">{{ state.nameError }}</span>
        </label>
        <label for="mobile">
          <span>전화번호</span>
          <input type="text" id="mobile" placeholder="01012345678" v-model="state.form.mobile" @blur="validateMobile" />
          <span v-if="state.mobileError" class="error-message">{{ state.mobileError }}</span>
        </label>
        <hr />
        <button type="submit" id="signupBtn">회원가입</button>
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
        name: "",
        mobile: ""
      },
      emailError: "",
      nameError: "",
      mobileError: ""
    });

    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!state.form.email) {
        state.emailError = "이메일을 입력해주세요.";
      } else if (!emailRegex.test(state.form.email)) {
        state.emailError = "올바른 이메일 형식이 아닙니다.";
      } else {
        state.emailError = "";
      }
    };

    const validatePassword = () => {
      const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;

      if (!state.form.password) {
        state.passwordError = "비밀번호를 입력해주세요.";
      } else if (state.form.password.length > 100) {
        state.passwordError = "비밀번호는 최대 100자 이하이어야 합니다.";
      } else if (specialCharacterRegex.test(state.form.password)) {
        state.passwordError = "비밀번호에 특수기호를 사용할 수 없습니다.";
      } else {
        state.passwordError = "";
      }
    };

    const validateName = () => {
      if (!state.form.name) {
        state.nameError = "이름을 입력해 주세요.";
      } else if (state.form.name.length < 2 || state.form.name.length > 50) {
        state.nameError = "이름은 최소 2자 이상, 최대 50자 이하이어야 합니다.";
      } else {
        state.nameError = "";
      }
    };

    const validateMobile = () => {
      const mobileRegex = /^[0-9]{10,11}$/;
      if (!state.form.mobile) {
        state.mobileError = "전화번호를 입력해 주세요.";
      } else if (!mobileRegex.test(state.form.mobile)) {
        state.mobileError = "유효한 전화번호를 입력해 주세요.";
      } else {
        state.mobileError = "";
      }
    };

    const submit = async () => {
      try {
        await axios.post("/api/signup", state.form, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        alert("회원가입에 성공했습니다.");
        router.push('/login');
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data;
          alert(`회원가입에 실패했습니다: ${errorMessage.email} ${errorMessage.password} ${errorMessage.name} ${errorMessage.mobile}`);
        } else {
          alert("회원가입에 실패했습니다. 네트워크 상태를 확인해주세요.");
        }
        console.error("회원가입 실패", error);
      }
    };

    return { state, submit, validateEmail, validateName, validateMobile, validatePassword };
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
  display: flex;
  justify-content: center; /* 로고를 좌우 중앙으로 정렬 */
  align-items: center;
  padding: 20px;
  background-color: none;
}

.logo {
  background-image: url('../assets/logo.png');
  background-size: contain; /* 이미지가 요소 안에 맞도록 조정 */
  background-repeat: no-repeat; /* 이미지 반복 안 함 */
  background-position: center; /* 이미지 중앙에 배치 */
  width: 300px;  /* 원하는 크기로 설정 */
  height: 80px;  /* 원하는 크기로 설정 */
}

.signup-container {
  flex: 0.5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.signup-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 300px;
}

label {
  display: block;
  margin-bottom: 10px;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4679BD;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

hr {
  margin: 20px 0;
  border: none;
  border-top: 1px solid #eee;
}
</style>