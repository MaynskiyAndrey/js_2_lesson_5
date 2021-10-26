const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

class GoodsItem {
	constructor(product_name, price) {
		this.product_name = product_name;
		this.price = price;
	}
	render() {
		return `<div class="goods-item"><h3>${this.product_name}</h3><p>${this.price}</p></div>`;
	}
}

class Cart {
	constructor() {
		this.items = [];
		this.isVisibleCart = false;
	}
	addItem(goodsItem, count) {
		const newItem = new CartItem(goodsItem, count);
		this.items.push(newItem);
	}
	removeItem(goodsItem) {
		let index = this.items.indexOf(s => s.goodItem === goodsItem);
		if (index > 1) {
			this.items.slice(index, 1);
		}
	}

	getSummCost() {
		const result = 0;
		this.items.reduce((item, index, array) => {
			result += item.goodItem.price * item.count;
		})

		return result;
	}
}

class CartItem {
	constructor(goodsItem, quantity) {
		this.googsItem = goodsItem;
		this.quantity = quantity;
	}

	addItem() {
		this.quantity++;
	}
	removeItem() {
		this.quantity--;
	}
}

const app = new Vue({
	el: '#app',
	data: {
		goods: [],
		filteredGoods: [],
		searchLine: '',
		cart: new Cart()
	},
	methods: {
		makeGETRequest(url) {
			return new Promise((resolve, reject) => {
				var xhr;

				if (window.XMLHttpRequest) {
					xhr = new XMLHttpRequest();
				} else if (window.ActiveXObject) {
					xhr = new ActiveXObject("Microsoft.XMLHTTP");
				}

				xhr.onreadystatechange = function () {
					if (xhr.readyState === 4) {
						if (xhr.status === 200) {
							resolve(xhr.responseText);
						}
						else {
							reject('Error');
						}
					}
				}

				xhr.open('GET', url, true);
				xhr.send();
			})
		},
		filterGoods() {
			const regexp = new RegExp(this.searchLine, 'i');
			this.filteredGoods = this.goods.filter(good => regexp.test(good.product_name));
		},
		changeVisibleBasket() {
			if (this.cart != null) {
				this.cart.isVisibleCart = !this.cart.isVisibleCart;
			}
		}
	},
	computed: {
		isVisibleCart() {
			if (this.cart != null) {
				return this.cart.isVisibleCart;
			}
			return false;

		}
	},
	mounted() {
		this.makeGETRequest(`${API_URL}/catalogData.json`)
			.then((goods) => {
				this.goods = JSON.parse(goods);
				this.filteredGoods = JSON.parse(goods);
			});


		this.makeGETRequest(`${API_URL}/getBasket.json`)
			.then((goods) => {
				JSON.parse(goods).contents.forEach((item) => {
					let goodsItem = new GoodsItem(item.product_name, item.price);
					this.cart.addItem(goodsItem, item.quantity);
				})
			})
	}
});