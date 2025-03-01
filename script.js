// GET BOOK DETAILS
document.addEventListener("DOMContentLoaded", async () => {
	const params = new URLSearchParams(window.location.search);
	const bookId = params.get("id");
	if (bookId) {
		const book = await fetchBook(bookId);
		if (book) {
			const bookDetails = getBookDetails(book);
			document.querySelector("#book-details").innerHTML = bookDetails;
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
		console.log(result);
		return result;
	} catch (error) {
		console.error("Error fetching book:", error);
		return null;
	}
}

function getBookDetails(book) {
	return `
		<div class="book__image">
			<img src="${
				book.formats["image/jpeg"] || "https://via.placeholder.com/150"
			}" alt="${book.title}" />
		</div>
		<div class="book__info">
			<h2 class="book__title">${book.title}</h2>
			<p class="book__author">By <span>${book.authors[0].name}</span></p>
			<p class="book__price">${
				book.price ? `$${book.price}` : "Price not available"
			}</p>
			<p class="book__rating">${
				book.rating ? `${book.rating} stars` : "Rating not available"
			}</p>
			<p class="book__description">${book.summaries[0]}</p>
		</div>
	`;
}
