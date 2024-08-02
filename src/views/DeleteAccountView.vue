<template>
    <div class="delete-account">
        <h1>회원탈퇴</h1>
        <p>정말로 회원탈퇴를 진행하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
        <form @submit.prevent="deleteAccount">
            <div>
                <label for="email">이메일:</label>
                <input type="email" id="email" v-model="email" required>
            </div>
            <div>
                <label for="password">비밀번호:</label>
                <input type="password" id="password" v-model="password" required>
            </div>
            <button type="submit">회원탈퇴</button>
        </form>
        <button @click="goBack">취소</button>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
    setup() {
        const router = useRouter();
        const email = ref('');
        const password = ref('');

        const deleteAccount = async () => {
            if (confirm("정말 회원탈퇴하시겠습니까?")) {
                try {
                    const response = await axios.delete('/api/delete', {
                        data: { email: email.value, password: password.value },
                        headers: { accesstoken: localStorage.getItem('accesstoken') }
                    });

                    if (response.data.msg === "회원탈퇴가 정상적으로 처리 되었습니다.") {
                        alert(response.data.msg);
                        localStorage.removeItem('accesstoken');
                        localStorage.removeItem('name');
                        localStorage.removeItem('items');
                        router.push('/');
                    } else {
                        alert("회원탈퇴 처리 중 오류가 발생했습니다.");
                    }
                } catch (error) {
                    alert("회원탈퇴에 실패했습니다. 다시 시도해주세요.");
                }
            }
        };

        const goBack = () => {
            router.go(-1);
        };

        return {
            email,
            password,
            deleteAccount,
            goBack
        };
    }
};
</script>

<style scoped>
.delete-account {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

form div {
    margin-bottom: 10px;
}

label {
    display: block;
    margin-bottom: 5px;
}

input {
    width: 100%;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button {
    margin-top: 10px;
    padding: 10px 15px;
    background-color: #4679BD;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button[type="submit"] {
    background-color: #FF4136;
}

button:hover {
    opacity: 0.8;
}

h1 {
    color: #333;
    margin-bottom: 20px;
    text-align: center; /* 추가: 텍스트를 중앙 정렬 */
}

p {
    color: #666;
    margin-bottom: 20px;
}
</style>
