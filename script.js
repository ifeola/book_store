// GET BOOK DETAILS
document.addEventListener("DOMContentLoaded", async () => {
	const params = new URLSearchParams(window.location.search);
	const bookId = params.get("id");
	console.log(bookId);

	if (bookId) {
		const book = await fetchBook(bookId);
		let suggestedBooks = await fetchBooks(URL);
		suggestedBooks = suggestedBooks.results;

		if (book && suggestedBooks) {
			const bookDetails = getBookDetails(book);
			document.querySelector("#book-details").innerHTML = bookDetails;

			// Display suggested books
			const suggestedBooksList = document.querySelector(
				".suggested__books-list"
			);
			suggestedBooksList.innerHTML = "";
			suggestedBooks.splice(0, 4).map((item) => {
				if (item.id !== book.id) {
					const bookItem = document.createElement("li");
					bookItem.classList.add("suggested__book");
					bookItem.innerHTML = `
					<a href="book.html?id=${item.id}">
						<div class="book__image">
							<img src="${
								item.formats["image/jpeg"] || "https://via.placeholder.com/150"
							}" alt="${item.title}" />
						</div>
						<div class="book__info">
							<h4 class="book__title">${item.title}</h4>
							<p class="book__author">By <span>${item.authors[0].name}</span></p>
						</div>
					</a>
				`;
					suggestedBooksList.appendChild(bookItem);
				}
			});
		} else {
			document.querySelector("#book-details").innerHTML =
				"<h1>Book not found.</h1>";
		}
	} else {
		document.querySelector("#book-details").innerHTML =
			"<h1>No book ID provided.</h1>";
	}
});

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

function getBookDetails(book) {
	return `
		<div class="book__content">
			<div class="book__image">
				<img src="${
					book.formats["image/jpeg"] || "https://via.placeholder.com/150"
				}" alt="${book.title}" />
			</div>
			<div class="book__info">
				<div class="top__info">
					<h2 class="book__title">${book.title}</h2>
					<p class="book__author">By <span>${book.authors[0].name}</span></p>
				</div>
				<a href="${book.formats["text/html"]}" class="book__btn">Read Book</a>
			</div>
			<p class="book__description">${book.summaries[0]}</p>
			<div class="book__lists">
				<div class="subjects">
					<h5>Subjects -</h5>
					<ul class="subject__list">
						${book.subjects.map((subject) => `<li>${subject}</li>`).join("")}
					</ul>
				</div>
				<div class="bookshelves">
					<h5>Bookshelves -</h5>
					<ul class="bookshelve__list">
						${book.bookshelves
							.map((bookshelve) => `<li><p>${bookshelve}</p></li>`)
							.join("")}
					</ul>
				</div>
			</div>
		</div>
	`;
}
