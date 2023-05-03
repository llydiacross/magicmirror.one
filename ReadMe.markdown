# MagicMirror by 0x0zAgency

Welcome to the new web.

## 🗿 Requirements

- MacOSX, Windows (XP, Vista, 7, 8, 10, 11), Debian 10, Ubuntu 20.04
- Node **18.12.1** ~~or higher~~
- ZSH, Fish or equivalent. **(Bash users may/not encounter issues.)**
- Redis
- Any database of your choice (compatible with Prisma ORM)

> It is __imperative__ for your sanity you follow these requirements to the letter!!!
> Web3 development is in development.

## 🗿 Setup

The project requires [Redis](<https://redis.io>) as a dependency to be installed for caching.

### MACOS 🍎

`brew install redis-cli`

### LINUX (Ubuntu / Debian) 🐧

This can (and should be in most circumstances) obtained from your package manager.
In the case of apt - based distros,

`sudo apt install -y redis-server redis-client`

### WINDOWS 🪟

You'll have to use docker. See the [setup instructions on the Redis website](<https://redis.io/download/#redis-downloads>)

### SETUP

Your `.env` will require a few extra keys for the Web2 endpoints.
These include:

- OPENAI_KEY
- JWT_KEY
- SIWE_SECRET
- DATABASE_URL

Your OpenAI key is your API token retrieved from [your dashboard on OpenAI's platform](<https://platform.openai.com>).

The JWT key is any string, or a valid SHA512 key that is used to sign your JWT tokens. Make sure this is an __extremely__ strong phrase!

The `SIWE_SECRET` is used for generating your Sign in with Ethereum sessions. This should also be a secure key!

Finally, the database URL should be a Prisma valid string used for connecting to your database layer. This is determined by you.

In summary, the bottom of your end should resemble something like this:

```dotenv
OPENAI_KEY="MYVERYSECRETSECUREKEYHERE"
JWT_KEY="80HSODJKFLH340OHJKLDSFIHUKJLKHDKLH)£U$)£($)HR£HKJDKSJHLK"
SIWE_SECRET="*KJSDFKALH34908OIHUJK0*(&^&%${ERFTGSHDKAIUHF)"
DATABASE_URL="postgresql://user:user@localhost:5432/mydb?schema=public"
```

## 🗿 Installation

Follow the setup instructions for your chosen database of choice.

It's also recommended you follow the instructions in the [Redis documentation](<https://redis.io/docs/management/config/>) to allow Redis to act as an [LRU] cache.

## Server instructions

To set up server-side, follow the following instructions __to the letter__. They are written in blood, sweat and tears.

- Install a fresh copy of __Ubuntu 20.04__. No other version has been successfully tested.
- Run the following commands:

```bash
# Update and upgrade your system.
apt update && apt upgrade -y --no-recommends
# Install Redis for the cache, Nginx to host your frontend (unless you're hosting it in another manner.)
# You should also install a database of your choice, this is used for SIWE authentication sessions for the *FakeRegistry* contracts feature.
apt install -y redis nginx ufw <your_db_of_choice>
# Install specifically NodeJS 18.12.1. Nothing else works. Do this in any manner you please.
sudo add-apt-repository -y -r ppa:chris-lea/node.js
sudo apt install curl
KEYRING=/usr/share/keyrings/nodesource.gpg
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | gpg --dearmor | sudo tee "$KEYRING" >/dev/null

# if using wget
sudo apt install wget
wget --quiet -O - https://deb.nodesource.com/gpgkey/nodesource.gpg.key | gpg --dearmor | sudo tee "$KEYRING" >/dev/null

VERSION=node_18.x
KEYRING=/usr/share/keyrings/nodesource.gpg
DISTRO="$(lsb_release -s -c)"
echo "deb [signed-by=$KEYRING] https://deb.nodesource.com/$VERSION $DISTRO main" | tee /etc/apt/sources.list.d/nodesource.list
echo "deb-src [signed-by=$KEYRING] https://deb.nodesource.com/$VERSION $DISTRO main" | tee -a /etc/apt/sources.list.d/nodesource.list

# Update your system package list again.
apt update

# Finally, install NodeJS.
apt install -y --no-recommends nodejs

```


> __WARNING!!__ If you're trying to build your project and are stuck at downloading the `solc` compiler during an npm install, check your node version!! It __must__ be on 18.12.1.
Check this with: `node -v`.

Within your repository, ensure you have your `.env` variables set and run `npm run server`.
This should start your API server with `pm2`.

Your Nginx config should look something like this:

```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass http://127.0.0.1:9090;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

You'll want to secure this with HTTPS. To do so, you'll need Certbot.
Do this through Snap.

`snap install certbot --classic`

Finally, once you confirmed your API server is running, your DNS for your domain name is pointing to your server and you see a "Cannot GET" page when you enter your API server IP in your browser, run:

`certbot --nginx -d api.example.com`

Congratulations! You've set up your API server with InfinityMint.

## Using this template

For developer convenience, [TailwindCSS](<https://tailwindcss.com>) is already plugged in with PostCSS.
If you do not wish to use it, simply uninstall & remove the following lines within your `webpack.config.js`

```js
// Starts at line 119
loader: require.resolve('postcss-loader'),
    options: {
     postcssOptions: {
      // Necessary for external CSS imports to work
      // https://github.com/facebook/create-react-app/issues/2677
      ident: 'postcss',
      config: true,
			// And so on..
```

## 🗿 Documentation

[Official Documentation](https://docs.infinitymint.app)

[TypeDoc Documentation](https://typedoc.org/)
