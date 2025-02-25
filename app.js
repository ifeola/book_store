const bookList = document.querySelector("#book__list");
const search = document.querySelector("#search");
const book = document.querySelector(".book__details");

let books = [];

bookList.addEventListener("click", async (event) => {
	const bookItem = event.target.closest(".book");
	if (!bookItem) return;

	const bookId = bookItem.id;
	const book = await fetchBook(bookId);

	const bookDetails = getBookDetails(book);
	bookItem.appendChild(bookDetails);
	bookItem.classList.toggle("active");
});

function getBookDetails(book) {
	const bookDetails = document.createElement("div");
	bookDetails.className = "book__details";
	bookDetails.innerHTML = `
		<div class="book__info">
			<h4 class="book__title">${book.title}</h4>
			<p class="book__author">By <span>${book.authors[0].name}</span></p>
			<p class="book__summary">${book.summaries[0]}</p>
		</div>
		<div class="book__actions">
			<span class="book__downloads">
				${book.download_count === 1 ? "Downloaded" : "Downloads"}:
				${book.download_count === 0 ? "No" : book.download_count}
			</span>
			<button class="book__cta">About this book</button>
		</div>
	`;
	return bookDetails;
}

async function fetchBook(id) {
	try {
		const response = await fetch(`https://gutendex.com/books/${id}`);
		if (!response.ok) {
			throw new Error("Failed to fetch book");
		}
		const result = await response.json();
		return result;
	} catch (error) {
		console.error("Error fetching book:", error);
		return null;
	}
}

async function fetchBooks() {
	try {
		const response = await fetch("https://gutendex.com/books/");
		if (!response.ok) {
			throw new Error("Failed to fetch books");
		}
		const result = await response.json();
		return result.results; // Return only the books array
	} catch (error) {
		console.error("Error fetching books:", error);
		bookList.innerHTML =
			"<h1>Error loading books. Please try again later.</h1>";
		return []; // Return an empty array in case of error
	}
}

function findBook() {
	// Filter books based on the search input
	searchInput = search.value;
	const filteredBooks = books.filter(
		(book) =>
			book.title.toLowerCase().includes(searchInput.toLowerCase()) ||
			book.authors[0].name.toLowerCase().includes(searchInput.toLowerCase())
	);
	renderBooks(filteredBooks);
}

search.addEventListener("keyup", findBook);

function renderLoading() {
	// Create 8 loading placeholders
	for (let i = 0; i < 8; i++) {
		const bookItem = document.createElement("li");
		bookItem.classList.add("loading");
		bookItem.innerHTML = `
					<div class="loading__image">
							<div class="image"></div>
					</div>
					<div class="loading__details">
							<div class="loading__info">
									<div class="loading__title"></div>
									<div class="loading__author"></div>
									<div class="loading__summary">
											<div class="summary"></div>
											<div class="summary"></div>
											<div class="summary"></div>
									</div>
							</div>
							<div class="loading__actions">
									<div class="loading__downloads"></div>
									<div class="loading__btn"></div>
							</div>
					</div>
			`;
		bookList.appendChild(bookItem); // Append each bookItem to the bookList
	}
}

function renderBooks(books) {
	bookList.innerHTML = ""; // Clear the loading message

	if (books.length === 0) {
		bookList.innerHTML = "<h1>No books found.</h1>";
		return;
	}

	books.forEach((book) => {
		const bookItem = document.createElement("li");
		bookItem.id = book.id;
		bookItem.className = "book";
		const imageUrl =
			book.formats["image/jpeg"] || "https://via.placeholder.com/150"; // Fallback image
		const authors = book.authors.map((author) => author.name); // Format authors

		bookItem.innerHTML = `
				<div class="book__image">
					<img src="${imageUrl}" alt="${book.title}" loading="lazy" />
				</div>
				<div class="book__details">
					<div class="book__info">
						<h4 class="book__title">${book.title}</h4>
						<p class="book__author">By <span>${authors}</span></p>
						<p class="book__summary">${book.summaries[0]}</p>
					</div>
					<div class="book__actions">
						<span class="book__downloads">
							${book.download_count === 1 ? "Downloaded" : "Downloads"}:
							${book.download_count === 0 ? "No" : book.download_count}
						</span>
						<a href="/books/book.html" class="book__cta" target="_blank">Read more</a>
					</div>
				</div>
    `;
		bookList.appendChild(bookItem);
	});
}

async function init() {
	renderLoading(); // Show loading state
	books = await fetchBooks(); // Fetch books
	renderBooks(books); // Render books
}

document.addEventListener("DOMContentLoaded", init);

/* const bookList = document.querySelector("#book__list");

async function fetchBooks() {
	let isLoading = true;
	const response = await fetch("https://gutendex.com/books/");
	const result = await response.json();
	let books = result.results;
	isLoading = false;
	return { books, isLoading };
}

async function renderBooks() {
	const { books, isLoading } = await fetchBooks();

	if (isLoading) {
		bookList.innerHTML = "<h1>Loading...</h1>";
		return;
	}

	books.forEach((book) => {
		const bookItem = document.createElement("li");
		bookItem.innerHTML = `
      <img src="${book.formats["image/jpeg"]}" alt="${book.title}" />
      <h3>${book.title}</h3>
      <p>${book.authors}</p>
    `;
		bookList.appendChild(bookItem);
	});
}

document.addEventListener("DOMContentLoaded", renderBooks);
 */
