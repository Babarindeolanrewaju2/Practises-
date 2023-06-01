<!-- Step 1: Set up a new Laravel project

If you haven't already, install Laravel using the instructions provided in the previous responses.

Step 2: Create Models and Migrations

Run the following commands to generate models and migrations for the "Author" and "Book" resources: -->

<!-- php artisan make:model Author -m
php artisan make:model Book -m -->

<!-- This will generate model files in the app/Models directory and migration files in the database/migrations directory.

Open the migration files (e.g., database/migrations/2023_01_01_000000_create_authors_table.php and database/migrations/2023_01_02_000000_create_books_table.php) and define the schema for the "authors" and "books" tables, including foreign keys. For example: -->

// authors migration
public function up()
{
    Schema::create('authors', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->timestamps();
    });
}

// books migration
public function up()
{
    Schema::create('books', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->unsignedBigInteger('author_id');
        $table->foreign('author_id')->references('id')->on('authors')->onDelete('cascade');
        $table->timestamps();
    });
}

<!-- Run the migrations to create the "authors" and "books" tables in the database: -->

php artisan migrate

<!-- Step 3: Define Eloquent Relationships

Open the model files (e.g., app/Models/Author.php and app/Models/Book.php) and define the relationships between the "Author" and "Book" models. For example: -->

// Author model
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
    protected $fillable = ['name'];

    public function books()
    {
        return $this->hasMany(Book::class);
    }
}

// Book model
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = ['title', 'author_id'];

    public function author()
    {
        return $this->belongsTo(Author::class);
    }
}

<!-- Step 4: Create Controllers

Generate controllers for handling the API requests. Run the following commands: -->

php artisan make:controller AuthorController --api
php artisan make:controller BookController --api

<!-- This will generate controller files in the app/Http/Controllers directory.

Open the controller files (e.g., app/Http/Controllers/AuthorController.php and app/Http/Controllers/BookController.php) and add the necessary methods for the API endpoints. Here's an example: -->

// AuthorController
namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\Request;

class AuthorController extends Controller
{
    public function index()
    {
        $authors = Author::with('books')->get();
        return response()->json($authors);
    }

    public function store(Request $request)
    {
        $author = Author::create($request->all());
        return response()->json($author, 201);
    }

    public function show($id)
    {
        $author = Author::with('books')->findOrFail($id);
        return response()->json($author);
    }

    public function update(Request $request, $id)
    {
        $author = Author::findOrFail($id);
        $author->update($request->all());
        return response()->json($author);
    }

    public function destroy($id)
    {
        $author = Author::findOrFail($id);
        $author->delete();
        return response()->json(null, 204);
    }
}

// BookController
namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index()
    {
        $books = Book::with('author')->get();
        return response()->json($books);
    }

    public function store(Request $request)
    {
        $book = Book::create($request->all());
        return response()->json($book, 201);
    }

    public function show($id)
    {
        $book = Book::with('author')->findOrFail($id);
        return response()->json($book);
    }

    public function update(Request $request, $id)
    {
        $book = Book::findOrFail($id);
        $book->update($request->all());
        return response()->json($book);
    }

    public function destroy($id)
    {
        $book = Book::findOrFail($id);
        $book->delete();
        return response()->json(null, 204);
    }
}

<!-- Step 5: Define API Routes

Open the routes/api.php file and define the routes for the API endpoints. Here's an example: -->

use App\Http\Controllers\AuthorController;
use App\Http\Controllers\BookController;

Route::get('/authors', [AuthorController::class, 'index']);
Route::post('/authors', [AuthorController::class, 'store']);
Route::get('/authors/{id}', [AuthorController::class, 'show']);
Route::put('/authors/{id}', [AuthorController::class, 'update']);
Route::delete('/authors/{id}', [AuthorController::class, 'destroy']);

Route::get('/books', [BookController::class, 'index']);
Route::post('/books', [BookController::class, 'store']);
Route::get('/books/{id}', [BookController::class, 'show']);
Route::put('/books/{id}', [BookController::class, 'update']);
Route::delete('/books/{id}', [BookController::class, 'destroy']);


<!-- Step 6: Test the API

Start the development server: -->

php artisan serve
<!--
You can now use a tool like Postman or cURL to send requests to the API endpoints:

Authors:

GET /api/authors - Retrieve all authors with their associated books
POST /api/authors - Create a new author
GET /api/authors/{id} - Retrieve a specific author with their associated books
PUT /api/authors/{id} - Update a specific author
DELETE /api/authors/{id} - Delete a specific author
Books:

GET /api/books - Retrieve all books with their associated authors
POST /api/books - Create a new book
GET /api/books/{id} - Retrieve a specific book with its associated author
PUT /api/books/{id} - Update a specific book
DELETE /api/books/{id} - Delete a specific book -->
