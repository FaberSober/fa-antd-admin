FROM mysql:5.7
ENV AUTO_RUN_DIR /docker-entrypoint-initdb.d
ENV INSTALL_DB_SQL init_database.sql
COPY ./$INSTALL_DB_SQL $AUTO_RUN_DIR/
RUN chmod 777 $AUTO_RUN_DIR/$INSTALL_DB_SQL