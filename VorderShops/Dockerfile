FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Vorder.WebAPI/Vorder.WebAPI.csproj", "Vorder.WebAPI/"]
COPY ["Vorder.Infrastructure/Vorder.Infrastructure.csproj", "Vorder.Infrastructure/"]
COPY ["Vorder.Application/Vorder.Application.csproj", "Vorder.Application/"]
COPY ["Vorder.Domain/Vorder.Domain.csproj", "Vorder.Domain/"]
RUN dotnet restore "./Vorder.WebAPI/Vorder.WebAPI.csproj"
COPY . .
WORKDIR "/src/Vorder.WebAPI"
RUN dotnet build "./Vorder.WebAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Vorder.WebAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Vorder.WebAPI.dll"]
