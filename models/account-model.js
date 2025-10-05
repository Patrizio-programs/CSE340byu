const accounts = [];

class Account {
  constructor(id, username, email) {
    this.id = id;
    this.username = username;
    this.email = email;
  }
}

function createAccount(username, email) {
  const id = accounts.length + 1;
  const account = new Account(id, username, email);
  accounts.push(account);
  return account;
}

function getAccountById(id) {
  return accounts.find((acc) => acc.id === id);
}

function getAllAccounts() {
  return accounts;
}

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

module.exports = {
  createAccount,
  getAccountById,
  getAllAccounts,
};
