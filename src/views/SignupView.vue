<template>
    <form @submit.prevent="submit" class="signup-form">
      <label for="email">
        <span>이메일</span>
        <input type="text" id="email" placeholder="aaa@example.com" v-model="state.form.email" />
      </label>
      <label for="password">
        <span>패스워드</span>
        <input type="password" id="password" v-model="state.form.password" />
      </label>
      <label for="name">
        <span>이름</span>
        <input type="text" id="name" v-model="state.form.name" />
      </label>
      <label for="mobile">
        <span>전화번호</span>
        <input type="text" id="mobile" placeholder="01012345678" v-model="state.form.mobile" />
      </label>
      <hr />
      <button type="submit">회원가입</button>
    </form>
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
      });
  
      const submit = async () => {
        try {
          await axios.post("/signup", state.form, {
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
  
      return { state, submit };
    },
  };
  </script>
  
  <style>
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
    width: calc(100% - 20px);
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  