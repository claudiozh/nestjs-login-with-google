# 🚀 NestJS Google OAuth Authentication

Este projeto é um serviço de autenticação com **NestJS** que permite login via **Google OAuth**. Ele possui dois endpoints principais:

1. `/auth/google/login` → Redireciona o usuário para a página de login do Google.
2. `/auth/google/callback` → Processa o retorno do Google, gera um `accessToken` e armazena nos cookies antes de redirecionar para o frontend.

## 📌 Tecnologias Utilizadas

- [NestJS](https://nestjs.com/)
- [Passport.js](http://www.passportjs.org/) com estratégia **Google OAuth**

## 📂 Instalação e Configuração

### 1️⃣ Clone o repositório

```sh
git clone https://github.com/claudiozh/nestjs-login-with-google
cd seu-repositorio
```

### 2️⃣ Instale as dependências

```sh
npm install
```

### 3️⃣ Configuração do Google OAuth

Crie um novo projeto no **[Google Cloud Console](https://console.cloud.google.com/)** e obtenha as credenciais OAuth.

Depois, crie um arquivo **`.env`** na raiz do projeto e adicione:

```env
GOOGLE_CLIENT_ID=SEU_CLIENT_ID
GOOGLE_CLIENT_SECRET=SEU_CLIENT_SECRET
FRONTEND_URL=http://localhost:3000
JWT_SECRET=uma_senha_super_secreta
```

### 4️⃣ Execute a aplicação

```sh
npm run start:dev
```

## 🔐 Como Funciona a Autenticação?

A autenticação é baseada em **Google OAuth 2.0** usando o **Passport.js**.

### 🛠️ Endpoints

#### 1️⃣ **Iniciar Login pelo Google**
- **Rota:** `GET /auth/google/login`
- **Protegido?** Não
- **Descrição:** Redireciona para a página de login do Google.

#### 2️⃣ **Callback do Google**
- **Rota:** `GET /auth/google/callback`
- **Protegido?** Não
- **Descrição:**  
  - O Google retorna o usuário autenticado.
  - Gera um `accessToken` usando o `AuthService`.
  - Salva o `accessToken` nos **cookies** (httpOnly, secure).
  - Redireciona para `FRONTEND_URL`.

## 🔄 Exemplo de Fluxo

1. O usuário acessa `/auth/google/login` e é redirecionado para o Google.
2. Após login, o Google redireciona para `/auth/google/callback`.
3. O backend gera um `accessToken` e o salva nos cookies.
4. O usuário é enviado de volta para o frontend com o token nos cookies.

## 📜 Código do `AuthController.ts`

```typescript
import { EnvService } from '@/env/env.service';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { RoutePublic } from '@/auth/decorators/route-public.decorator';
import { GoogleAuthGuard } from '@/auth/guards/google-auth.guard';
import { AuthService } from '@/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly envService: EnvService,
    private readonly authService: AuthService,
  ) {}

  @RoutePublic()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  async googleLogin() {}

  @RoutePublic()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const { accessToken } = await this.authService.login(req.user.id);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    res.redirect(this.envService.get('FRONTEND_URL'));
  }
}
```
