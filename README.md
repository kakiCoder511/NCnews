# NC News Seeding
## Environment Setup
You must create two .env files for your databases:

.env.test (for the test database).
.env.development (for the development database).

Double-check that your .gitignore file includes .env.* so these files aren't pushed to GitHub.


> 📝 These environment variables allow your code to connect to the correct local PostgreSQL databases during development and testing.

Make sure you have created both `nc_news` and `nc_news_test` databases locally using the setup script:

## npm run setup-dbs
This command will create both `nc_news` and `nc_news_test` databases locally, as defined in `setup-dbs.sql`.

