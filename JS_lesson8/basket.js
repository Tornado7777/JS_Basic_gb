class Product {
	constructor(name, price, count) {
		this.name = name;
		this.price = +price.slice(1);
		this.count = count;
	}

	/**
	 * @returns {string} html-разметка для товара
	 */
	htmlBasketProduct() {
		return `
	<div class="basketRow" data-id=${this.id}>
	 	<div>${this.name}</div>
		<div>${this.count}</div>
		<div>${this.price} $</div>
		<div>${this.price * this.count} $</div>
	</div>
	`
	}
}

class Products {
	constructor() {
		this.products = [];
		this.allCount = 0;
		this.allCost = 0;
	}

	/**
	 * Добавлет товар в массив класса, если не существует. 
	 * Если существует пересчитывает кол-во и стоимость, а так же 
	 * пересчитывает общее кол-во  и стоимсть
	 * @param {childNodes} - данные узлов из класса featuredData 
	 */
	addProduct(dataNodes) {
		const name = dataNodes[1].textContent.trim();
		const indexProduct = this.checkBasketProducts(name);
		const price = dataNodes[5].textContent.trim();

		if (indexProduct >= 0) {
			this.products[indexProduct].count++;
			this.allCost += this.products[indexProduct].price;
			this.allCount++;
		} else {
			//если такого продукта нет в корзине
			const product = new Product(
				name,
				price,
				1
			);
			this.products.push(product);
			this.allCount++;
			this.allCost += product.price;
		}


		// изменить общее кол-во 
		document.querySelector('.cartIconWrap > span')
			.textContent = this.allCount;
		document.querySelector('.basketTotal')
			.innerHTML = `Товаров в корзине на сумму: ${this.allCost} $ <span class="basketTotalValue">${this.allCount}</span>`;
	}


	/**
	 * Проверяет наличие товара в массиве класса. 
	 * Если существует возвращает индекс, нет "-1"
	 * @return {number} - возвращает индекс в массиве 
	 * products класса Products 
	 */
	checkBasketProducts(name) {
		for (let i = 0; i < this.products.length; i++) {
			if (this.products[i].name === name) {
				return i;
			}
		}
		return -1;
	}

	/**
	 * Генерирует и вставляет html  код перед div с классом basketTotal.
	 * Код генерируется на основе массива products класса Products
	 */
	generateHtmlProducts() {
		document.querySelectorAll('.basketRow').forEach((elem, index) => {
			if (index != 0) {
				elem.remove()
			}
		});
		document.querySelector('.basketTotal')
			.insertAdjacentHTML('beforebegin', productsMas.products.map(
				product => product.htmlBasketProduct()
			).join(''));
	}
}

const productsMas = new Products();

const cartIconWrap = document.querySelector('.cartIconWrap');
cartIconWrap.addEventListener('click', (event) => {
	cartIconWrap.querySelector('.basket').classList.toggle('hidden');
});

const featuredItems = document.querySelector('.featuredItems');
featuredItems.addEventListener('click', (event) => {
	if (event.target.tagName !== "BUTTON") {
		return;
	}
	productsMas.addProduct(
		event.target.parentElement.parentElement.parentElement
			.querySelector('.featuredData').childNodes
	);
	productsMas.generateHtmlProducts();
});

