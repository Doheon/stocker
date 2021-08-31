<template>
    <div v-if="favoriteList.length > 0" class="table-wrap">
        <table class="table table-hover" style="margin: auto; margin-top: 50px; text-align: left">
            <thead class="thead-dark">
                <tr>
                    <th>종목명</th>
                    <th>현재가</th>
                    <th>등락률</th>
                    <th>
                        <div id="reloadBtn" @click="updatePrice"></div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(name, index) in favoriteList"
                    :index="index"
                    :key="name"
                    class="tableRow"
                >
                    <favorite-row
                        :name="name"
                        :updateList="getFavoriteList"
                        :ref="name"
                    ></favorite-row>
                </tr>
            </tbody>
        </table>
    </div>
    <div v-else>
        <br />
        <br />
        즐겨찾기한 종목이 없습니다. <br />
        검색화면의
        <button
            type="button"
            class="btn waves-effect waves-light btn-color bbb"
            style="font-size: 14.5px"
            id="fakeBtn"
        >
            <img src="@/assets/images/add.png" alt="" class="btnimg" />
        </button>
        아이콘을 클릭해서 즐겨찾기를 추가할 수 있습니다.
    </div>
</template>

<script>
import FavoriteRow from "@/components/favoriteRow";

export default {
    data() {
        return {
            favoriteList: [],
        };
    },
    components: {
        FavoriteRow,
    },
    methods: {
        getFavoriteList() {
            var favoriteList = localStorage.getItem("favorites");
            if (favoriteList) {
                favoriteList = JSON.parse(favoriteList);
                this.favoriteList = favoriteList;
            }
        },
        updatePrice() {
            this.getFavoriteList();
            for (var n of this.favoriteList) {
                this.$refs[n].updateData();
            }
        },
    },
    created() {
        this.getFavoriteList();
    },
    beforeRouteEnter(to, from, next) {
        next();
        this.getFavoriteList();
    },
};
</script>

<style>
#reloadBtn {
    cursor: pointer;
    content: url("../assets/images/reload2.png");
    height: 30px;
    width: 30px;
}
#reloadBtn:hover {
    content: url("../assets/images/reload_gray.png");
}

.table {
    min-width: 320px;
    border-collapse: separate;
    border-spacing: 0 10px;
}
.table thead th {
    border: none;
    padding: 15px;
    font-size: 15px;
    color: #fff;
    font-weight: 200;
}
.table tbody tr {
    margin-bottom: 10px;
    line-height: 35px;
    -webkit-box-shadow: 0px 5px 12px -12px rgba(0, 0, 0, 0.29);
    -moz-box-shadow: 0px 5px 12px -12px rgba(0, 0, 0, 0.29);
    box-shadow: 0px 5px 12px -12px rgba(0, 0, 0, 0.29);
}
.table tbody th,
.table tbody td {
    border: none;
    padding: 15px;
    font-size: 14px;
    background: rgba(255, 255, 255, 0.801);
}

.table tbody tr:hover {
    background: rgba(0, 0, 0, 0.568);
    cursor: pointer;
}
thead {
    height: 50px;
}

#fakeBtn:hover {
    cursor: default;
}

@media (max-width: 767px) {
    .table thead th {
        border: none;
        padding: 15px;
        font-size: 13px;
        color: #fff;
    }
    .table tbody tr {
        margin-bottom: 10px;
        line-height: 35px;
        -webkit-box-shadow: 0px 5px 12px -12px rgba(0, 0, 0, 0.29);
        -moz-box-shadow: 0px 5px 12px -12px rgba(0, 0, 0, 0.29);
        box-shadow: 0px 5px 12px -12px rgba(0, 0, 0, 0.29);
    }
    .table tbody th,
    .table tbody td {
        border: none;
        padding: 15px;
        font-size: 11px;
        background: rgba(255, 255, 255, 0.801);
    }

    .table tbody tr:hover {
        background: rgba(0, 0, 0, 0.568);
        cursor: pointer;
    }
    thead {
        height: 50px;
    }
}
</style>
