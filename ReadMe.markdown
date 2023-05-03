# MagicMirror by 0x0zAgency

Welcome to the new web.

## 🗿 Requirements

- Mac OSX (any version), Windows (XP, Vista, 7, 8, 10, 11), Debian (5+), Ubuntu (14+)
- Node **16.0.0** or Higher
- ZSH, Fish or equivalent. **(Bash users may/not encounter issues.)**
- Redis

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

## 🗿 Boilerplates & Starter-kits

Don't feel like using this template? Check out our other boilerplates and starter-kits and get building with InfinityMint straight away!

[Javascript Boilerplate](https://github.com/0x0zAgency/infinitymint-javascript-boilerplate)

[React Starter-kit (Typescript)](https://github.com/0x0zAgency/infinitymint-react-typescript-starterkit)

[React Starter-kit (Javascript)](https://github.com/0x0zAgency/infinitymint-react-javascript-starterkit)

[NextJS Starter-kit](https://github.com/0x0zAgency/infinitymint-nextjs-starterkit)

## 🗿 Installation

**Simply use this repository as a template**. By using this repository as a template it should automatically create a new git repository for you.

Please note that if you are running this through an online workspace, be patient. Wait for the Github workspace commands to fully complete before running `npm start`. The *postCommandScript* is already gathering your node dependencies for you :)

## Using this template

For developer convenience, [TailwindCSS](<https://tailwindcss.com>) is already plugged in with PostCSS.
If you do not wish to use it, simply uninstall & remove the following lines within your `webpack.config.js`:

```js
// Starts at line 119
loader: require.resolve('postcss-loader'),
    options: {
     postcssOptions: {
      // Necessary for external CSS imports to work
      // https://github.com/facebook/create-react-app/issues/2677
      ident: 'postcss',
      config: true,
			// And so on...
```

## 🗿 Documentation

[Official Documentation](https://docs.infinitymint.app)

[TypeDoc Documentation](https://typedoc.org/)
