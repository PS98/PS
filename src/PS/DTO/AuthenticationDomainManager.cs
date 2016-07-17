using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Http.Features;
using PS.Services;

namespace PS.DTO
{
    public class AuthenticationDomainManager
    {
        private readonly MongoRepository _repo;
        private const string Database = "userSessionDetails";
        public AuthenticationDomainManager()
        {
             _repo = new MongoRepository(Database);
        }
        private static string RandomStringAndNumber(int length)
        {
            const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public string GenerateAuthToken(string email )
        {
            var accessToken = RandomStringAndNumber(256);
            if (string.IsNullOrEmpty(accessToken))
                accessToken = RandomStringAndNumber(256);

           _repo.InsertDocument(Database, "TokenDetails",new UserSession {UserId = email, Token = accessToken});
            return accessToken;
        }

        public string GetOrGenerateAuthToken(string email)
        {
            var data = _repo.GetDocumentList<UserSession>("TokenDetails");
            var accessToken = data.FirstOrDefault(r => r.UserId == email);
            return string.IsNullOrEmpty(accessToken?.Token) ? GenerateAuthToken(email) : accessToken.Token;
        }
    }
}
