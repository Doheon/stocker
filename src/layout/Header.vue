<template>
    <header>
        <div class="logo">
            <h1 id="log">Stocker</h1>
        </div>
        <nav>
            <ul>
                <li>
                    <router-link to="/" active-class="active"
                        ><img src="@/assets/images/search2.png" alt="" /><em
                            >종목 검색</em
                        ></router-link
                    >
                </li>
                <li>
                    <router-link to="/favorite" active-class="active"
                        ><img src="@/assets/images/favorite.png" alt="" /><em
                            >즐겨찾기</em
                        ></router-link
                    >
                </li>
            </ul>
        </nav>
    </header>
</template>

<script>
export default {
    name: "AppHeader",
};
</script>

<style>
img {
    width: 30px;
    height: 30px;
}
nav {
    top: 70px;
    text-align: center;
    background: rgba(0, 0, 0, 0.75);
    position: fixed;
    z-index: 100;
    height: 90%;
    width: 120px;
    left: 0;
    font-weight: 300;
    font-size: 1rem;
}

nav em {
    font-style: normal;
    font-size: 13px;
    text-transform: uppercase;
    display: block;
    margin-top: 15px;
    color: #fff;
    /* margin: 20px; */
}

nav ul {
    padding: 0px;
}

nav ul li {
    text-align: center;
    margin-top: 20px;
    /* margin-right: 100px; */
}

nav a,
nav a:visited,
nav a:active {
    color: #fff;
}

nav a {
    text-decoration: none !important;
    display: inline-block;

    /* padding: 15px 30px; */
    padding-top: 20px;
    width: 100px;
    height: 100px;
    position: relative;
    z-index: 0;
    transition: all 0.5s;
}

nav a.active {
    background-color: rgb(0, 0, 0.8);
}

nav a::before {
    content: "";
    position: absolute;
    height: 0%;
    width: 0%;
    bottom: 0;
    left: 0;
    opacity: 1;
    z-index: -1;
}

.logo {
    margin-top: 0px;
    top: 0;
    left: 0;
    z-index: 999999;
    position: fixed;
    display: inline-block;
    text-align: center;
    background-color: #4d5794;
    height: 70px;
    width: 120px;
}
.logo h1 {
    font-size: 18px;
    text-transform: uppercase;
    font-weight: 900;
    color: rgb(255, 255, 255);
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    font-family: Arial;
}

@media (max-width: 767px) {
    img {
        width: 20px;
        height: 20px;
    }

    nav a {
        text-decoration: none !important;
        display: inline-block;

        /* padding: 15px 30px; */
        padding-top: 15px;
        width: 83px;
        height: 83px;
        position: relative;
        z-index: 0;
        transition: all 0.5s;
    }
    nav ul li {
        text-align: center;
        margin-top: 10px;
        /* margin-right: 100px; */
    }
    .logo {
        display: none;
    }
    nav {
        text-align: center;
        background: rgba(0, 0, 0, 0.75);
        position: relative;
        top: 0;
        z-index: 100;
        height: 105px;
        width: 100vw;
        font-weight: 300;
        font-size: 1rem;
    }

    nav em {
        font-style: normal;
        font-size: 13px;
        text-transform: uppercase;
        display: block;
        /* margin-top: 15px; */
        color: #fff;
        /* margin: 20px; */
    }

    nav ul {
        padding: 0px;
    }

    nav ul li {
        text-align: center;
        display: inline-block;
        /* margin-top: 20px; */
        /* margin-right: 100px; */
    }
}
</style>
